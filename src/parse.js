import tokens from "./tokens";
import flatMap from "./flatMap";

/*
Hutton, Graham. (1999). Higher-Order Functions for Parsing. Journal of Functional Programming. 2. 10.1017/S0956796800000411. 
https://pdfs.semanticscholar.org/6669/f223fba59edaeed7fabe02b667809a5744d9.pdf
*/

// mimics the cons function as used in (Graham, 1999)
const cons = ([a, b]) => [a].concat(b);

// an empty list denotes failure
const fail = (inp) => [];

// singleton list denotes success, where v is the value and inp is unconsumed input
const succeed = (v, inp) => [[v, inp]];

// construct a parser which applies predicate p to the first element of input
const satisfy = (p) => (inp) =>
  inp.length === 0
    ? fail(inp)
    : p(inp[0])
    ? succeed(inp[0], inp.slice(1))
    : fail(inp);

const literal = (x) => satisfy((y) => x === y);

// make a parser variadic ie. variadic(p)(a, b, c) => p(a, p(b, c))
const variadic = (p) =>
  function repeat(inp) {
    const [first, second, third, ...rest] = arguments;
    if (third) {
      return p(first, repeat(second, third, ...rest));
    } else {
      return p(first, second);
    }
  };

// construct a parser which applies p1 or p2 (inclusive)
const alt = (p1, p2) => (inp) => p1(inp).concat(p2(inp));
const valt = variadic(alt);

// construct a parser which applies p1, then applies p2 to p1s unconsumed output
const then = (p1, p2) => (inp) =>
  flatMap(p1(inp), ([v1, out1]) =>
    p2(out1).map(([v2, out2]) => [[v1, v2], out2])
  );

// construct a parser which applies f to everything it consumes
const using = (p, f) => (inp) => p(inp).map(([v, out]) => [f(v), out]);

// construct a parser which matches p zero or more times
const many = (p) =>
  alt(
    using(
      then(p, (out) => many(p)(out)),
      cons
    ),
    (inp) => succeed([], inp)
  );

// construct a parser which matches p one or more times
const some = (p) => using(then(p, many(p)), cons);

const number = some(satisfy((x) => "0" <= x <= "9"));

const string = (str) =>
  using(then(literal(str[0]), string(str.slice(1))), cons);

const xthen = (p1, p2) => using(then(p1, p2), ([a, b]) => a);

const thenx = (p1, p2) => using(then(p1, p2), ([a, b]) => b);

const value = (p, v) => using(p, () => v);

const parse = many(expn);

function expn(inp) {
  return valt(
    using(then(term, xthen(literal("+"), term)), ([a, b]) => a + b),
    using(then(term, xthen(literal("-"), term)), ([a, b]) => a - b),
    term
  )(inp);
}

function term(inp) {
  return valt(
    using(then(factor, xthen(literal("*"), factor)), ([a, b]) => a * b),
    using(then(factor, xthen(literal("/"), factor)), ([a, b]) => a / b),
    factor
  )(inp);
}

function factor(inp) {
  return valt(
    using(number, value),
    xthen(literal("("), thenx(expn, literal(")")))
  )(inp);
}

export { fail, succeed, satisfy, literal, alt, then, using, many, some, parse };
