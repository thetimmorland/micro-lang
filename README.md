# BNF

[https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form]

program = {statement}

expression = "(" plus | minus ")"

term = unary {( "/" | "\*" ) unary}

unary = ["+" | "-"] primary

primary = number | ident

nl = {'\n'}

lexer strips comments and whitespace
