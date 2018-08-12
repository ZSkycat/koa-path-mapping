import { Middleware } from 'koa';
export declare function pathMappingMiddleware(input: PathMappingOptionsInput): Middleware;
export interface MappingOption {
    action: 'redirect' | 'rewrite';
    from: RegExp | string;
    to: string;
}
export interface ErrorOption {
    action: 'redirect' | 'rewrite';
    status?: number;
    from?: RegExp | string;
    to: string;
}
export interface PathMappingOptions {
    mapping: MappingOption[];
    error: ErrorOption[];
    ignoreJson: boolean;
    enableLog: boolean;
    logger: Function;
}
export declare type PathMappingOptionsInput = Partial<PathMappingOptions>;
