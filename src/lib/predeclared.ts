import { lexing } from "./lexer";
import { Env,  unwrap } from "./types";

export function init_env(): Env {
    let names: string[] = [];
    let values: any[] = [];
    function add_macros(name: string, source: string) {
        const content = unwrap(lexing(source));
        names.push(name);
        values.push(["macro", content]);
    }
    function add_function(name: string, source: (x: any) => any) {
        names.push(name);
        values.push(["function", source]);
    }
    add_macros("new", "[>]");
    add_macros("cpy", "x=.;>x");
    add_function("chr", (x: number) => String.fromCharCode(x));
    add_function("BOF", (_: number) => '🧠');
    return [{names, values}, null];
}

export function create_macros(source: string) {
    const content = unwrap(lexing(source));
    return ["macro", content];
}
