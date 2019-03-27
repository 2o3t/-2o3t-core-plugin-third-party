'use strict';

const assert = require('assert');
const onerror = require('koa-onerror');
const helmet = require('koa-helmet'); // 安全相关
const cors = require('kcors'); // 跨域
const json = require('koa-json');

module.exports = function(app) {
    assert.ok(app);

    app.use(helmet());

    app.use(cors());

    app.use(json());

    return async function onerrorMiddleware(ctx, next) {
        if (app.config.dev) {
            onerror(ctx.app);
        }
        await next();
    };
};
