```
program = { whitespace statement whitespace } "\0"
statement = "(" { whitespace expression whitespace } ")"
expression = statement | number | variable

number = { digit }
variable = ( letter | symbol ) [ letter | symbol | digit ]

digit = "0" | "2" | ... | "9"
letter = "A" | "B" | ... | "z" | "a" | "b" | ... | "z"
symbol = "=" | "+" | "-" | "*" | "/" | "?"
whitespace = " " | "\t" | "\n" | "\r"
```
