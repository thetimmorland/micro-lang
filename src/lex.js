import tokens from "./tokens";
import flatMap from "./flatMap";

const tokenLookup = {
  "\0": tokens.EOF,
  "\n": tokens.NEWLINE,
  "=": tokens.EQ,
  "+": tokens.PLUS,
  "-": tokens.MINUS,
  "*": tokens.ASTERISK,
  "/": tokens.SLASH,
  GOTO: tokens.GOTO,
  PRINT: tokens.PRINT,
  INPUT: tokens.INPUT,
  LET: tokens.LET,
  IF: tokens.IF,
  THEN: tokens.THEN,
  ENDIF: tokens.ENDIF,
  WHILE: tokens.WHILE,
  REPEAT: tokens.REPEAT,
  ENDWHILE: tokens.ENDWHILE,
  "==": tokens.EQEQ,
  "!=": tokens.NOTEQ,
  "<": tokens.LT,
  "<=": tokens.LTEQ,
  ">": tokens.GT,
  ">=": tokens.GTEQ,
};

export function stripComments(string) {
  return string.replace(/#.*/g, "");
}

export function splitTokens(string) {
  string = flatMap(string.split(/(\n)/), (str) =>
    // matches tabs and spaces which are not quoted
    str.split(/[ \t]+(?=(?:[^"]*"[^"]*")*[^"]*$)/)
  );

  return string.filter((elem) => elem != "");
}

export function getToken(string) {
  var lookup = tokenLookup[string];

  if (lookup === undefined) {
    if (string.match(/^\d+(\.\d+)?$/)) {
      return tokens.NUMBER;
    } else if (string.match(/^[A-z]\w*$/)) {
      return tokens.IDENT;
    } else if (string.match(/^".*"$/)) {
      return tokens.STRING;
    } else {
      throw "Unknown token: " + string;
    }
  } else {
    return lookup;
  }
}

export function lex(code) {
  const noComments = stripComments(code);
  const tokenStrings = splitTokens(noComments);
  return tokenStrings.map((string) => [getToken(string), string]);
}
