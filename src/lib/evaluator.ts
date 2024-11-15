import { init_env } from "./predeclared";
import { Result, Token, TokenType, ok, error, Env, EnvFrame} from "./types";

// naive brainfuck evaluator
export function bf_evaluate(tokens: Token[], mem_return = false): Result<any[] | [number[], number[], any], string> {
    const mem = [0];
    let mem_pos = 0;
    let token_pos = 0;
    let stash: number[] = [];
    let marker: number[] = [];
    let global_env: Env = init_env(); // [name, value]
    let current_env: Env = global_env;
    
    function find(env: Env, name: any): any | null {
        if (env !== null) {
            const frame = (<[EnvFrame, Env]>env)[0];
            function $find(names: string[], values: any[]) {
                for (let i = 0; i < names.length; i = i + 1) {
                    if (names[i] === name) {
                        return values[i];
                    }
                }
                return null;
            }
            const value = $find(frame.names, frame.values);
            if (value != null) return value;
            return find((<[EnvFrame, Env]>env)[1], name);
        }
        return null;
    }

    function assign(env: Env, name: string, value: any){
        if (env !== null) {
            const frame = (<[EnvFrame, Env]>env)[0];
            const next_env = (<[EnvFrame, Env]>env)[1];
            const $names = frame.names;
            const $values = frame.values;
            
            for (let i = 0; i < $names.length; i = i + 1) {
                if ($names[i] === name) {
                    $values[i] = value;
                    return [{names: $names, values: $values}, next_env];// new env
                }
            }
            $names.push(name)
            $values.push(value)
            const new_env =  [{names: $names, values: $values}, next_env];
  
            return new_env;
        }
        return [{names: [name], values: [value]}, null];
    }

    function match(t: TokenType) {
        if (token_pos >= tokens.length || tokens[token_pos].type != t) return false;
        return true;
    }
    function consume(t: TokenType, msg: string) {
        if (token_pos >= tokens.length || tokens[token_pos].type != t) throw new Error(msg);
        token_pos+=1;
    }
    function sequences() {
        
        if (token_pos < tokens.length) {
            const first = declaration();
            sequences();
        }
    }


    function declaration() {
        const token = tokens[token_pos];
        if (token.type == TokenType.IDENTIFIER) {
            const name = token.lexeme;
            token_pos += 1;
            if (match(TokenType.EQUAL)) {
                consume(TokenType.EQUAL, "Expect `=` after identifier");
                token_pos -= 1;
                let value = expression(); 
                current_env = <Env>assign(current_env, name, value);
                return value;
            } else if (match(TokenType.MACRO)) {
                consume(TokenType.MACRO, "Expect `$=` after identifier");
                const macro = [];
                while (!match(TokenType.BREAK) && token_pos < tokens.length) {
                    macro.push(tokens[token_pos]);
                    token_pos += 1;
                }
                current_env = <Env>assign(current_env, name, ["macro", macro]);
                return 0;
            } else {
                // assign identifier the value
                const result = find(current_env, name);
                if (result == null) throw new Error(`Cannot find name '${name}' in this scope.`)
                if (Array.isArray(result)) {
                    if (result[0] === "macro") {
                        result[1].push({type: TokenType.NEW_LINE, lexeme: ""});
                        tokens.splice(token_pos, 0, ...result[1]);
                    } else if (result[0] === "function") {
                        stash.push(result[1](mem[mem_pos]));
                        // token_pos+=1;
                    }

                } else {
                    mem[mem_pos] = result; // literal
                }
                return result;
            }
        } else {
            return expression();
        }
    }
    function expression(): number {
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
                while (token_pos < tokens.length && tokens[token_pos].type != TokenType.RIGHT_PAREN) {
                    token_pos += 1;
                }
            }
        }
        if (token.type == TokenType.RIGHT_PAREN) {
            const top = marker.pop();
            if (top && mem[mem_pos] > 0) {
                token_pos = top - 1;
            }
        } 
        
        token_pos += 1;
        if (token_pos < tokens.length) {
            if (tokens[token_pos].type == TokenType.NEW_LINE) {
                token_pos+=1;
                return mem[mem_pos];
            } else {
                return declaration();
            }
        }
        
        return mem[mem_pos];
    }
    try {
        sequences();
    } catch (e) {
        return error((<Error>e).message);
    }
    if (!mem_return) return ok(stash);
    else return ok([stash, mem, mem_pos]);
}

/*
Checklist
[/] Variable declaration
[/] Macro declaration
[/] Comments
[ ] Function
*/

/*
Multiplication 
x=+++++.; > ; y=+++. ; > ;
>x>y[<x[<+>-]>-].
*/