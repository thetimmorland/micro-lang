# BNF

[https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form]

program = {statement}

statement =\
 | "PRINT" (expression | string) nl\
 | "LET" ident "=" expression nl\
 | "IF" comparison "THEN" nl {statement} "ENDWHILE" nl\
 | "WHILE" comparison "REPEAT" nl {statement} "ENDWHILE" nl\
 | "GOTO" ident nl\
 | "INPUT" ident nl

comparison = expression {("==" | "!=" | ">" | ">=" | "<" | "<=") expression}

expression = term {( "-" | "+" ) term}

term = unary {( "/" | "\*" ) unary}

unary = ["+" | "-"] primary

primary = number | ident

nl ::= {'\n'}
