import { popover } from "@nextui-org/react";
import { Result, Token, TokenType, ok } from "./types";

// naive brainfuck evaluator
export function bf_evaluate(tokens: Token[], mem_return = false): Result<number[] | [number[], number[]], string> {
    const mem = [0];
    let mem_pos = 0;
    let token_pos = 0;
    let stash: number[] = [];
    let marker: number[] = [];
    function $bf_evaluate() {
        const token = tokens[token_pos];
        if (token.type == TokenType.LEFT) mem_pos = Math.max(0, mem_pos - 1);
        if (token.type == TokenType.RIGHT) {
            mem_pos += 1;
            if (mem_pos >= mem.length) mem.push(0);
        }
        if (token.type == TokenType.PLUS) mem[mem_pos] += 1;
        if (token.type == TokenType.MINUS) mem[mem_pos] -= 1;
        if (token.type == TokenType.DOT) stash.push(mem[mem_pos]);
        if (token.type == TokenType.LEFT_PAREN) {
            if (mem[mem_pos] != 0) {
                marker.push(token_pos);
            } else {
                console.log("GOTCHA")
                while (token_pos < tokens.length && tokens[token_pos].type != TokenType.RIGHT_PAREN) {
                    token_pos += 1;
                }
            }
        }
        if (token.type == TokenType.RIGHT_PAREN) {
            const top = marker.pop();
            console.log("JMP", top);
            if (top && mem[mem_pos] > 0) {
                token_pos = top - 1;
            }
        }
        token_pos += 1;
        if (token_pos < tokens.length) $bf_evaluate();
    }
    $bf_evaluate();
    if (!mem_return) return ok(stash);
    else return ok([stash, mem]);
}

// macros 
