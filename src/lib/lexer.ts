import { TokenType, Token } from "./types";
import {Result, ok, error} from "./types";
export function lexing(source: string): Result<Token[], String> {
    const tokens: Token[] = [];
    let start = 0;
    let current = 0;
    let end = source.length;
    let line = 1;
    while (!isAtEnd()) {
        start = current;
        const c = advance();
        if (isAlphaNumeric(c)) {
            identifier();
        } else if (isWhiteSpace(c)) {
            continue;
        } else if (c == '\n' || c == ';') {
            line+=1;
            tokens.push({type: TokenType.NEW_LINE, lexeme: ""});
        } else if (c == '|') {
            tokens.push({type: TokenType.BREAK, lexeme: ""});
        } else if (c == '/') {
            const next_symbol = advance();
            if (next_symbol !== '/') {
                return error('Expected // for comments.');
            }
            while (!isAtEnd()) {
                const next_symbol = peek();
                if (next_symbol == '\n') break;
                advance();
            }
        } else if (c=='$') {
            const next_symbol = advance();
            if (next_symbol !== '=') {
                return error('Expected = after $ for macros.');
            }
            advance();
            tokens.push({type: TokenType.MACRO, lexeme: ""});
        } else if (c== '[' ) {
            tokens.push({type: TokenType.LEFT_PAREN, lexeme: ""});
        } else if (c== ']' ) {
            tokens.push({type: TokenType.RIGHT_PAREN, lexeme: ""});
        } else if (c== '.' ) {
            tokens.push({type: TokenType.DOT, lexeme: ""});
        } else if (c== '=' ) {
            tokens.push({type: TokenType.EQUAL, lexeme: ""});
        } else if (c== '<' ) {
            tokens.push({type: TokenType.LEFT, lexeme: ""});
        } else if (c== '>' ) {
            tokens.push({type: TokenType.RIGHT, lexeme: ""});
        } else if (c==',') {
            tokens.push({type: TokenType.COMMA, lexeme: ""});
        } else if (c== '+' ) {
            tokens.push({type: TokenType.PLUS, lexeme: ""});
        } else if (c== '-' ) {
            tokens.push({type: TokenType.MINUS, lexeme: ""});
        } else {
            return error(`Unexpected token ${c} at line ${line}.`);
        }
    }
    function isAtEnd() {
        return current >= end;
    } 
    function advance() {
        current = current + 1;
        return source[current - 1];
    }
    function peek() {
        return isAtEnd() ? '\0' : source[current];
    }
    function isWhiteSpace(c: string) {
        return c == ' ' || c == '\t';
    }
    function isAlpha(c: string) {
        return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c == '_';
    }
    function isDigit(c: string) {
        return c >= '0' && c <= '9';
    }
    function isAlphaNumeric(c: string) {
        return isDigit(c) || isAlpha(c);
    }
    function identifier() {
        while (isAlphaNumeric(peek())) {
            advance();
        }
        const value = source.substring(start, current);
        tokens.push({type: TokenType.IDENTIFIER, lexeme: value});
    }
    return ok(tokens);
}