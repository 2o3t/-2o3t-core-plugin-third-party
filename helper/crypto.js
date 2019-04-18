'use strict';

const crypto = require('crypto');// 生成口令的散列值

module.exports = function cryptoHelper(app, opts) {

    const inter = {};

    inter.bhash = function(str) {
        let hash = crypto.createHash('sha256');
        if (Array.isArray(str)) {
            str.forEach(item => {
                hash = hash.update(item);
            });
        } else {
            hash = hash.update(str);
        }
        const result = hash.digest('hex');
        return result;
    };

    inter.md5 = function(data) {
        let md5 = crypto.createHash('md5');
        if (Array.isArray(data)) {
            data.forEach(item => {
                md5 = md5.update(item, 'utf8');
            });
        } else {
            md5 = md5.update(data, 'utf8');
        }
        const result = md5.digest('hex');
        return result;
    };

    // 获取随机字符串
    inter.getID = function(length) {
        return crypto.randomBytes(length).toString('hex');
    };

    return inter;
};
