'use strict';

const parser = require('ua-parser-js');

module.exports = function() {

    // Agent
    return async function agentMiddleware(ctx, next) {

        const IPS = ctx.req.headers['x-forwarded-for'] ||
            ctx.req.connection.remoteAddress ||
            ctx.req.socket.remoteAddress ||
            ctx.req.connection.socket && ctx.req.connection.socket.remoteAddress || ctx.ip;

        // get user-agent header
        const UA = parser(ctx.request.headers['user-agent']);
        // {
        //   ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
        //   browser: { name: 'Chrome', version: '63.0.3239.84', major: '63' },
        //   engine: { name: 'WebKit', version: '537.36' },
        //   os: { name: 'Mac OS', version: '10.13.2' },
        //   device: { vendor: undefined, model: undefined, type: undefined },
        //   cpu: { architecture: undefined }
        // }

        let ips = IPS;
        if (IPS && !Array.isArray(IPS)) {
            ips = IPS.split(',').map(item => {
                return item.trim();
            });
        }
        if (Array.isArray(ips)) {
            ips = Array.from(new Set(ips));
            ips = ips.reverse().join(',');
        }

        ctx.agent = {
            IP: ips,
            UA,
        };

        await next();
    };
};
