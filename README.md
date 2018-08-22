# koa-path-mapping
[![version](https://img.shields.io/npm/v/koa-path-mapping.svg)](https://www.npmjs.com/package/koa-path-mapping)
[![downloads](https://img.shields.io/npm/dt/koa-path-mapping.svg)](https://www.npmjs.com/package/koa-path-mapping)

Koa middleware for redirect or path rewrite of requests. Support path rewrite of failed requests.<br>
用于对请求进行重定向或路径重写的 koa 中间件，支持对失败的请求进行路径重写。<br>

允许对 404 请求进行路径重写，并回退到 `next()`，对于以下场景非常有用：
- 使用 `HTML5 History API` 的单页应用和多页应用
- 使用 `webpack-dev-middleware` 的开发服务器，例如 `webpack-serve`

## 起步
**安装**
```
npm install --save-dev koa-path-mapping
```

**用法**
```javascript
const Koa = require('koa');
const pathMappingMiddleware = require('koa-path-mapping').pathMappingMiddleware;

const app = new Koa();
const options = {
    mapping: [
        { action: 'redirect', from: '^/$', to: '/login' },
        { action: 'rewrite', from: '^/game($|/)', to: '/app-game.html' },
    ],
    error: [{ action: 'rewrite', status: 404, to: '/app.html' }],
};
app.use(pathMappingMiddleware(options));
```

## API
```javascript
pathMappingMiddleware(options: PathMappingOptions)
```

### PathMappingOptions
创建中间件的选项。

### PathMappingOptions.mapping
**类型:** `MappingOptions[]`<br>
**默认:** `[]`<br>
[参考](#mappingoptions)

### PathMappingOptions.error
**类型:** `ErrorOptions[]`<br>
**默认:** `[]`<br>
[参考](#erroroptions)

### PathMappingOptions.ignoreJson
**类型:** `boolean`<br>
**默认:** `true`<br>
是否忽略 `application/json` 的请求。

### PathMappingOptions.enableLog
**类型:** `boolean`<br>
**默认:** `false`<br>
是否输出日志。

### PathMappingOptions.logger
**类型:** `Function`<br>
**默认:** `console.log`<br>
设置输出日志所使用的函数。

---

### MappingOptions
对请求进行重定向或路径重写，在进入时执行。

### MappingOptions.action
**类型:** `'redirect' | 'rewrite'`<br>
设置执行的动作，必填。

### MappingOptions.from
**类型:** `RegExp | string`<br>
设置匹配的 `path`，如果未设置，则匹配所有的请求。值要求为 `RegExp` 实例，或是 `RegExp` 格式的字符串。

### MappingOptions.to
**类型:** `string`<br>
设置目标的 `path`，必填。

---

### ErrorOptions
对失败的请求进行重定向或路径重写，在 `next()` 之后执行。如果匹配成功并执行路径重写，那么会再一次执行 `next()`。

### ErrorOptions.action
**类型:** `'redirect' | 'rewrite'`<br>
设置执行的动作，必填。

### ErrorOptions.status
**类型:** `number`<br>
设置匹配的状态码，如果未设置，则匹配 `status >= 400`。

### ErrorOptions.from
**类型:** `RegExp | string`<br>
设置匹配的 `path`，如果未设置，则匹配所有的请求。值要求为 `RegExp` 实例，或是 `RegExp` 格式的字符串。

### ErrorOptions.to
**类型:** `string`<br>
设置目标的 `path`，必填。

## License
[MIT](https://github.com/ZSkycat/koa-path-mapping/blob/master/LICENSE.txt)
