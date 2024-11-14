export enum TokenType {
    LEFT_PAREN, RIGHT_PAREN, DOT, EQUAL, NEW_LINE, IDENTIFIER,
    LEFT, RIGHT, PLUS, MINUS, COMMA, MACRO
}

export interface Token {
    type: TokenType,
    lexeme: string
}

export type Error<E = unknown> = {
    _tag: "Error";
    data: E;
}

export type Ok<T = void> = {
    _tag: "Ok";
    data: T;
}

export type Result<T = void, E = unknown> = Ok<T> | Error<E>;

export function ok<T = void>(data: T): Ok<T> {
    return {
        _tag: "Ok",
        data: data,
    }
}

export function error<E = unknown>(error: E): Error<E> {
    return {
        _tag: "Error",
        data: error,
    }
}

export function is_error<T, E>(data: Result<T, E>): boolean {
    return data._tag == "Error";
}

export function is_ok<T, E>(data: Result<T, E>): boolean {
    return data._tag == "Ok";
}

export function unwrap<T, E>(data: Result<T, E>): any {
    if (data._tag == "Error") {
        return data.data;
    } else {
        return data.data;
    }
}


// Environment
export interface EnvFrame {
    names: string[],
    values: any
}
export type Env = null | [EnvFrame, Env];