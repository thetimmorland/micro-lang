import * as lex from "./lex";
import tokens from "./tokens";

test("stripComments", () => {
  expect(lex.stripComments("foo # comment")).toBe("foo ");
  expect(lex.stripComments("foo # comment\nbar")).toBe("foo \nbar");
});

test("whitespace is split correctly", () => {
  expect(lex.splitTokens("a b c \n")).toStrictEqual(["a", "b", "c", "\n"]);
  expect(lex.splitTokens('a "b c"')).toStrictEqual(["a", '"b c"']);
  expect(lex.splitTokens("\n\n\0")).toStrictEqual(["\n", "\n", "\0"]);
});

test("getToken", () => {
  expect(lex.getToken("42")).toBe(tokens.NUMBER);
  expect(lex.getToken("3.1415")).toBe(tokens.NUMBER);
  expect(() => {
    lex.getToken("24.");
  }).toThrow();
  expect(lex.getToken("foo")).toBe(tokens.IDENT);
  expect(lex.getToken("bar123")).toBe(tokens.IDENT);
  expect(lex.getToken('"bar"')).toBe(tokens.STRING);
});

test("lex", () => {
  expect(lex.lex("foo * 2\n")).toStrictEqual([
    [tokens.IDENT, "foo"],
    [tokens.ASTERISK, "*"],
    [tokens.NUMBER, "2"],
    [tokens.NEWLINE, "\n"],
  ]);
});
