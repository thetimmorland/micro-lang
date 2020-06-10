import tokens from "./tokens";
import flatMap from "./flatMap";

/*
# Notes on functional parsing:

A parser is a mapping of arr: input => [(arr: result, arr: remainder)]
The below code gets confusing since we have to use arrays instead o tuples in javascript
*/

// helper functions for constructing parser return values
const success = (result, input) => [[result, input]];
const fail = (input) => [];

// constructs a new parser using a given test
const satisfy = (test) => (input) =>
  input.length === 0
    ? fail(input)
    : test(input[0])
    ? success(input[0], input.slice(0))
    : fail(input);

// constructs a parser which applies two parsers one after the other
const then = (parser1, parser2) => (input) =>
  flatMap(parser1(input), ([result1, remainder1]) =>
    parser2(remainder1).map(([result2, remainder2]) => [
      [result1, result2],
      remainder2,
    ])
  );

// constructs a parser which applies two parsers to the same input
const alt = (left, right) => (input) => left(input).concat(right(input));

const token = (t) => satisfy((x) => x === t);
