import { EnvFrame, TokenType } from "./types";

export const predeclared_objects: EnvFrame = {
    names: ["new", "chr"],
    values: [
        ["macro", [{type:TokenType.LEFT_PAREN,lexeme:""},
        {type:TokenType.RIGHT,lexeme:""},
        {type:TokenType.RIGHT_PAREN,lexeme:""}
        ]],
        ["function", (x: number) => String.fromCharCode(x)]
    ]
}