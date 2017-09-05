'use strict';

var dbConfig = require('./routes').dbConfig;

var config ={

    NODE_ENV:"development",
    NODE_HOST:"localhost",
    NODE_DEVELOPMENT_PORT : 3000,
    NODE_TEST_PORT : 3001,
    NODE_LIVE_PORT : 3002,
    dbConfig : dbConfig,
    appConstants : require("./appConstants")
};

module.exports = config;
