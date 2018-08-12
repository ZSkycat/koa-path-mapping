import { Middleware } from 'koa';
import * as compose from 'koa-compose';

const ID_KEY = '__PathMapping';

export function pathMappingMiddleware(input: PathMappingOptionsInput): Middleware {
    let options = resolveOptions(input);
    let result: Middleware = async function(context, next) {
        if (options.ignoreJson && context.header.accept && (<string>context.header.accept).indexOf('application/json') !== -1) {
            await next();
            return;
        }

        loopM: for (let item of options.mapping) {
            if (resolveRegExp(item.from).test(context.path)) {
                switch (item.action) {
                    case 'redirect':
                        context.redirect(item.to);
                        if (options.enableLog) options.logger(`[PM] redirect ${context.path} to ${item.to}`);
                        return;
                    case 'rewrite':
                        context.path = item.to;
                        if (options.enableLog) options.logger(`[PM] rewrite ${context.path} to ${item.to}`);
                        break loopM;
                }
            }
        }

        await next();

        for (let item of options.error) {
            if ((item.status && item.status === context.status) || (item.status == undefined && context.status >= 400)) {
                if (item.from && resolveRegExp(item.from).test(context.path)) {
                    switch (item.action) {
                        case 'redirect':
                            context.redirect(item.to);
                            if (options.enableLog) options.logger(`[PM] error-redirect ${context.path} to ${item.to}`);
                            return;
                        case 'rewrite':
                            let index = context.app.middleware.findIndex(x => (<any>x)[ID_KEY] === true);
                            let afterMiddleware = context.app.middleware.slice(index + 1);
                            let fnMiddleware = compose(afterMiddleware);
                            context.path = item.to;
                            if (options.enableLog) options.logger(`[PM] error-rewrite ${context.path} to ${item.to}`);
                            await fnMiddleware(context);
                            return;
                    }
                }
            }
        }
    };
    (<any>result)[ID_KEY] = true;
    return result;
}

function resolveOptions(options: PathMappingOptionsInput) {
    let defaultOptions: PathMappingOptions = {
        mapping: [],
        error: [],
        ignoreJson: true,
        enableLog: false,
        logger: console.log,
    };
    return Object.assign(defaultOptions, options);
}

function resolveRegExp(regexp: string | RegExp) {
    if (typeof regexp === 'string') return new RegExp(regexp);
    else return regexp;
}

// #region type
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

export type PathMappingOptionsInput = Partial<PathMappingOptions>;
// #endregion
