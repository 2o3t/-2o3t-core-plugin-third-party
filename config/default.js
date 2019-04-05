'use strict';

module.exports = {
    middleware: {
        mixins: [
            'thirdParty',
            'agent',
            'session',
            'koaBody',
        ],

        thirdParty: {
            enable: true,
        },

        agent: {
            enable: true,
        },
    },

    helper: {
        mixins: [
            'crypto',
            'randomWord',
        ],
    },
};
