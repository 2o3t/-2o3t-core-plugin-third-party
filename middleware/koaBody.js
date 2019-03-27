'use strict';
const assert = require('assert');
const koaBody = require('koa-body');
const compose = require('koa-compose');

module.exports = function(app, opts) {
    assert.ok(app);

    const options = Object.assign({
        // patchNode: true,
        multipart: false, // 支持文件上传
        strict: false,
    }, opts);

    // return koaBody(options);

    return compose([ koaBody(options), async function(ctx, next) {
        // 打印 解析的 body
        try {
            const bodyInfo = ctx.request.body;
            app.logger.info('【 requestBody 】', bodyInfo);
        } catch (error) {
            app.logger.error(error);
        }
        await next();
    } ]);
};
