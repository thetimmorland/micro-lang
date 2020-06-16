import flatMap from "./flatMap";
import { version } from "react";

/*
Hutton, Graham. (1999). Higher-Order Functions for Parsing. Journal of Functional Programming. 2. 10.1017/S0956796800000411. 
https://pdfs.semanticscholar.org/6669/f223fba59edaeed7fabe02b667809a5744d9.pdf
*/

// an empty list denotes failure
export const fail = (inp) => [];

// singleton list denotes success, where v is the value and inp is unconsumed input
export const succeed = (v, inp) => [[v, inp]];

// construct a parser which applies predicate p to the first element of input
export const satisfy = (p) => ([x, ...xs]) =>
  x ? (p(x) ? succeed(x, xs) : fail()) : fail();

export const literal = (x) => satisfy((y) => x === y);

// makes a combinator parser variadic through nesting
// variadic(p)(a, b, c) has the same behaviour as p(a, p(b, c))
export const variadic = (p) =>
  function repeat(first, second, third, ...rest) {
    if (third) {
      return p(first, repeat(second, third, ...rest));
    } else {
      return p(first, second);
    }
  };

// construct a parser which applies p1 or p2 (inclusive)
export const alt = (p1, p2) => (inp) => (p1(inp).length ? p1(inp) : p2(inp));
export const valt = variadic(alt);

// construct a parser which applies p1, then applies p2 to p1s unconsumed output
export const then = (p1, p2) => (inp) =>
  flatMap(p1(inp), ([v1, out1]) =>
    p2(out1).map(([v2, out2]) => [[v1, v2], out2])
  );
export const vthen = variadic(then);

// construct a parser which applies f to everything it consumes
export const using = (p, f) => (inp) => p(inp).map(([v, out]) => [f(v), out]);

// construct a parser which matches p zero or more times
export const many = (p) => (inp) =>
  p(inp).length // zero length implies failure
    ? using(
        then(p, (inp) => many(p)(inp)),
        ([a, b]) => [a, ...b]
      )(inp)
    : succeed([], inp);

// construct a parser which matches p one or more times
export const some = (p) => using(then(p, many(p)), ([a, b]) => [a, ...b]);

// like then() but discards part of the match denoted by x
const xthen = (p1, p2) => using(then(p1, p2), ([_, snd]) => snd);
const thenx = (p1, p2) => using(then(p1, p2), ([fst, _]) => fst);
export const xthenx = (p1, p2, p3) => xthen(p1, thenx(p2, p3));

// matches any continuous block of whitespace
export const whitespace = many(
  valt(literal("\n"), literal("\t"), literal(" "))
);

// program = [ statement ] "\0"
export function program(inp) {
  const parser = thenx(
    many(xthenx(whitespace, statement, whitespace)),
    literal("\0")
  );
  return parser(inp);
}

// statement = "(" [ expression ] ")"
export function statement(inp) {
  const parser = xthenx(
    literal("("),
    many(xthenx(whitespace, expression, whitespace)),
    literal(")")
  );
  return parser(inp);
}

// expression = statement | number | symbol
export function expression(inp) {
  const parser = valt(statement, variable, number);
  return parser(inp);
}

// number = { digit }
export function number(inp) {
  const parser = using(some(digit), (x) => parseInt(x.join("")));
  return parser(inp);
}

// symbol = (letter | symbol) [ letter | symbol | digit ]
export function variable(inp) {
  const parser = using(
    then(alt(letter, symbol), many(valt(letter, symbol, digit))),
    ([a, b]) => [...a, ...b].join("")
  );

  return parser(inp);
}

// digit = "0" | "1" | ... | "9"
export function digit(inp) {
  const parser = satisfy((x) => x >= "0" && x <= "9");
  return parser(inp);
}

// letter = "A" | "B" | ... | "z" | "a" | "b" | ... | "z"
export function letter(inp) {
  const parser = some(
    satisfy((x) => (x >= "A" && x <= "Z") || (x >= "a" && x <= "z"))
  );
  return parser(inp);
}

// symbol = "=" | "+" | "-" | "*" | "/" | "?" | "!"
export function symbol(inp) {
  const parser = valt(
    literal("="),
    literal("+"),
    literal("-"),
    literal("*"),
    literal("/"),
    literal("?"),
    literal("!")
  );
  return parser(inp);
}

export default function parser(str) {
  str = str.replace(/;.*$/gm, ""); // strip comments
  return program([...str.split(""), "\0"]); // split string into array and append null character
}
