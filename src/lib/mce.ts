import { bf_evaluate } from "./evaluator";
import { lexing } from "./lexer";
import { Result, unwrap, ok, is_error, error } from "./types";
export function ParseAndEvaluate(source: string): Result<Number[], String> {
    
    if (source.length == 0) {
        return error(`[PARSING ERROR] Expected at least one character.`);
    }
    const tokens = lexing(source);
    if (is_error(tokens)) {
        return error(`[PARSING ERROR] ${tokens.data}`);
    }
    const evaluated = bf_evaluate(unwrap(tokens));
    return ok(unwrap(evaluated));
}

