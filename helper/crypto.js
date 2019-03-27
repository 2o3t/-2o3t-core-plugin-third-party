'use strict';

const crypto = require('crypto');// 生成口令的散列值

module.exports = function(app, opts) {

    const inter = {};

    inter.bhash = function(str) {
        const hash = crypto.createHash('sha256');
        hash.update(str);
        const result = hash.digest('hex');
        return result;
    };

    inter.md5 = function(data) {
        const md5 = crypto.createHash('md5')
            .update(data, 'utf-8')
            .digest('hex');
        return md5;
    };


    return inter;
};
