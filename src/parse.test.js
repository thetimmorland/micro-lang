import parse, {
  fail,
  succeed,
  literal,
  alt,
  then,
  using,
  many,
  some,
  xthenx,
} from "./parse";

import codeTemplate from "./codeTemplate";

test("literal", () => {
  const parser = literal(3);
  expect(parser([3, 4, 5])).toStrictEqual(succeed(3, [4, 5]));
});

test("alt", () => {
  const parser = alt(literal(2), literal(1));
  expect(parser([1, 2, 3])).toStrictEqual(succeed(1, [2, 3]));
  expect(parser([2, 1, 3])).toStrictEqual(succeed(2, [1, 3]));
});

test("then", () => {
  const parser = then(literal(1), literal(2));
  expect(parser([1, 2, 3, 4])).toStrictEqual(succeed([1, 2], [3, 4]));
});

test("using", () => {
  const parser = using(literal(1), (x) => x.toString());
  expect(parser([1, 2, 3])).toStrictEqual(succeed("1", [2, 3]));
});

test("many", () => {
  const parser = many(literal(1));
  expect(parser([1, 2])).toStrictEqual(succeed([1], [2]));
  expect(parser([1, 1, 2])).toStrictEqual(succeed([1, 1], [2]));
  expect(parser([2, 1])).toStrictEqual(succeed([], [2, 1]));
});

test("some", () => {
  const parser = some(literal(1));

  expect(parser([2, 1])).toStrictEqual(fail());
  expect(parser([1, 1])).toStrictEqual(succeed([1, 1], []));
});

test("xthenx", () => {
  const parser = xthenx(literal(1), literal(2), literal(3));
  expect(parser([1, 2, 3])).toStrictEqual(succeed(2, []));
});

test("parse", () => {
  const out = parse(codeTemplate);
  expect(out).toStrictEqual(
    succeed(
      [
        [
          "defun",
          "factorial",
          ["n"],
          ["if", ["=", "n", 0], 1, ["*", "n", ["factorial", ["-", "n", 1]]]],
        ],
        ["print", ["factorial", 5]],
      ],
      []
    )
  );
});
