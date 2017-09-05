'use strict';
/**
 * Created by shahab on 12/7/15.
 */
var mongoose = require('mongoose');
var Config = require('../Config');
var Service = require('../Services');
var async = require('async');
var winston = require("winston");


// Connect to MongoDB
mongoose.connect(Config.dbConfig.uri, function (err) {
    if (err) {
        winston.info("DB Error: ", err);
        process.exit(1);
    } else {
        winston.info('MongoDB Connected');
    }
});

exports.bootstrapAdmin = function (callback) {
    var adminData1 = {
        email: 'mamtarajput925@gmail.com',
        password: '565fdb43462efef831c018f2e91cecbb',//mamta
        name: 'Mamta@123',
        userType:0
    };
    var adminData2 = {
        email: 'infallible925@gmail.com',
        password: 'e10adc3949ba59abbe56e057f20f883e',//123456
        name: 'infallible',
        userType:0
    };
    var adminData3 = {
        email: 'admin@gmail.com',
        password: 'e10adc3949ba59abbe56e057f20f883e',//123456
        name: 'Admin',
        userType:0
    };
    
    async.parallel([
        function (cb) {
            insertData(adminData1.email, adminData1, cb)
        },
        function (cb) {
            insertData(adminData2.email, adminData2, cb)
        },
        function (cb) {
            insertData(adminData3.email, adminData3, cb)
        }
    ], function (err, done) {
        callback(err, 'Bootstrapping finished');
    })


};





function insertData(email, adminData, callback) {
    var needToCreate = true;
    async.series([function (cb) {
        var criteria = {
            email: email
        };
        Service.AdminService.getAdmin(criteria, {}, {}, function (err, data) {
            if (data && data.length > 0) {
                needToCreate = false;
            }
            cb()
        })
    }, function (cb) {
        if (needToCreate) {
            Service.AdminService.createAdmin(adminData, function (err, data) {
                cb(err, data)
            })
        } else {
            cb();
        }
    }], function (err, data) {
        winston.info('Bootstrapping finished for ' + email);
        callback(err, 'Bootstrapping finished')
    })
}








