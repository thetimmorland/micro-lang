# Grammar

program ::= {statement}

statement ::=\
 | "PRINT" (expression | string) nl\
 | "LET" ident "=" expression nl\
 | "IF" comparison "THEN" nl {statement} "ENDWHILE" nl\
 | "WHILE" comparison "REPEAT" nl {statement} "ENDWHILE" nl\
 | "GOTO" ident nl\
 | "INPUT" ident nl

comparison ::= expression (("==" | "!=" | ">" | ">=" | "<" | "<=") expression)+

expression ::= term {( "-" | "+" ) term}

term ::= unary {( "/" | "\*" ) unary}

unary ::= ["+" | "-"] primary

primary ::= number | ident

nl ::= '\n'+

## Legend

(): Grouping\
{}: Zero or more\
[]: Zero or one\
\+: One or more of left\
|: logical or
