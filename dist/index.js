"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compose = require("koa-compose");
const ID_KEY = '__PathMapping';
function pathMappingMiddleware(input) {
    let options = resolveOptions(input);
    let result = async function (context, next) {
        if (options.ignoreJson && context.header.accept && context.header.accept.indexOf('application/json') !== -1) {
            await next();
            return;
        }
        loopM: for (let item of options.mapping) {
            if (resolveRegExp(item.from).test(context.path)) {
                switch (item.action) {
                    case 'redirect':
                        context.redirect(item.to);
                        if (options.enableLog)
                            options.logger(`[PM] redirect ${context.path} to ${item.to}`);
                        return;
                    case 'rewrite':
                        context.path = item.to;
                        if (options.enableLog)
                            options.logger(`[PM] rewrite ${context.path} to ${item.to}`);
                        break loopM;
                }
            }
        }
        await next();
        for (let item of options.error) {
            if ((item.status == undefined && context.status >= 400) || (item.status && item.status === context.status)) {
                if (item.from == undefined || (item.from && resolveRegExp(item.from).test(context.path))) {
                    switch (item.action) {
                        case 'redirect':
                            context.redirect(item.to);
                            if (options.enableLog)
                                options.logger(`[PM] error-redirect ${context.path} to ${item.to}`);
                            return;
                        case 'rewrite':
                            let index = context.app.middleware.findIndex(x => x[ID_KEY] === true);
                            let afterMiddleware = context.app.middleware.slice(index + 1);
                            let fnMiddleware = compose(afterMiddleware);
                            context.path = item.to;
                            if (options.enableLog)
                                options.logger(`[PM] error-rewrite ${context.path} to ${item.to}`);
                            await fnMiddleware(context);
                            return;
                    }
                }
            }
        }
    };
    result[ID_KEY] = true;
    return result;
}
exports.pathMappingMiddleware = pathMappingMiddleware;
function resolveOptions(options) {
    let defaultOptions = {
        mapping: [],
        error: [],
        ignoreJson: true,
        enableLog: false,
        logger: console.log,
    };
    return Object.assign(defaultOptions, options);
}
function resolveRegExp(regexp) {
    if (typeof regexp === 'string')
        return new RegExp(regexp);
    else
        return regexp;
}
// #endregion
//# sourceMappingURL=index.js.map