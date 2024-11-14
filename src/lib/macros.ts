import { EnvFrame, TokenType } from "./types";

export const predeclared_macros: EnvFrame = {
    names: ["new"],
    values: [
        ["macro", [{type:TokenType.LEFT_PAREN,lexeme:""},
        {type:TokenType.RIGHT,lexeme:""},
        {type:TokenType.RIGHT_PAREN,lexeme:""}
        ]]
    ]
}