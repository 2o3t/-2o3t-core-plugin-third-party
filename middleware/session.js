'use strict';
const assert = require('assert');
const koaSession = require('koa-session2');
const Store = koaSession.Store;

module.exports = function(app, opts) {
    assert.ok(app);
    const config = app.config;
    const redisHelper = app.loadHelper.redis;
    const md5Sign = app.loadHelper.crypto.md5;

    const SESSION_KEY = opts && opts.key || config.SESSION_KEY || '2O3T';
    const SESSION_MAX_AGE = opts && opts.maxAge;

    class RedisStore extends Store {
        constructor() {
            super();
            this.redis = redisHelper;
        }

        async get(sid, ctx) {
            try {
                const data = await this.redis.get(sid);
                const session = JSON.parse(data);
                return session;
            } catch (e) { // 出错了,就清空
                ctx.cookies.set(SESSION_KEY, '', { overwrite: true });
            }
            return null;
        }

        async set(session, { sid = this.getID(24), maxAge = 1000000 } = {}, ctx) {
            if (session && session[SESSION_KEY]) { // 换成 SESSION_KEY
                sid = `${SESSION_KEY}:${session[SESSION_KEY]}`;
                sid = md5Sign(sid);
            }
            try {
                // Use redis set EX to automatically drop expired sessions
                if (config.dev) {
                    await this.redis.set(
                        sid,
                        JSON.stringify(session),
                        maxAge / 1000
                    );
                } else {
                    await this.redis.set(
                        sid,
                        JSON.stringify(session),
                        'EX',
                        maxAge / 1000
                    );
                }
            } catch (e) {
                // nothing;
            }
            return sid;
        }

        async destroy(sid, ctx) {
            ctx.cookies.set(SESSION_KEY, '', { overwrite: true });
            await this.redis.del(sid);
        }
    }

    const store = new RedisStore();
    return koaSession({
        key: SESSION_KEY,
        maxAge: SESSION_MAX_AGE,
        store,
    });
};
