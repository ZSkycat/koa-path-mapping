import { Middleware } from 'koa';
export declare function pathMappingMiddleware(input: PathMappingOptionsInput): Middleware;
export interface MappingOptions {
    action: 'redirect' | 'rewrite';
    from: RegExp | string;
    to: string;
}
export interface ErrorOptions {
    action: 'redirect' | 'rewrite';
    status?: number;
    from?: RegExp | string;
    to: string;
}
export interface PathMappingOptions {
    mapping: MappingOptions[];
    error: ErrorOptions[];
    ignoreJson: boolean;
    enableLog: boolean;
    logger: Function;
}
export declare type PathMappingOptionsInput = Partial<PathMappingOptions>;
