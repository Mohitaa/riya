'use strict';
/**
 * Created by shahab on 11/7/15.
 */
var Config = require('../Config');
var APP_CONSTANTS = require('../Config/appConstants');
var Jwt = require('jsonwebtoken');
var async = require('async');
var Service = require('../Services');


var getTokenFromDB = function (userId, userType,token, callback) {
    var userData = null;
    var criteria = {
        _id: userId,
        accessToken : token
    };
    async.series([
        function (cb) {
            switch(userType){
                case APP_CONSTANTS.DATABASE.USER_ROLES.CUSTOMER :
                    Service.CustomerService.getCustomer(criteria,{},{lean:true}, function (err, dataAry) {
                        if (err){
                            cb(err)
                        }else {
                            if (dataAry && dataAry.length > 0){
                                userData = dataAry[0];
                                cb();
                            }else {
                                cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
                            }
                        }

                    });
                    break;
                case APP_CONSTANTS.DATABASE.USER_ROLES.DRIVER :
                    Service.DriverService.getDriver(criteria,{},{lean:true}, function (err, dataAry) {
                        if (err){
                            cb(err)
                        }else {
                            if (dataAry && dataAry.length > 0){
                                userData = dataAry[0];
                                cb();
                            }else {
                                cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
                            }
                        }

                    });
                    break;
                    case APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN :
                    Service.AdminService.getAdmin(criteria,{},{lean:true}, function (err, dataAry) {
                        if (err){
                            callback(err)
                        }else {
                            if (dataAry && dataAry.length > 0){
                                userData = dataAry[0];
                                cb();
                            }else {
                                callback(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
                            }
                        }

                    });
                    break;
                default :
                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);

            }
        }
    ], function (err, result) {
        if (err){
            callback(err)
        }else {
            if (userData && userData._id){
                userData.id = userData._id;
                userData.type = userType;
            }
            callback(null,{userData: userData})
        }

    });
};

var setTokenInDB = function (userId,userType, tokenToSave, callback) {
    var criteria = {
        _id: userId
    };
    var setQuery = {
        accessToken : tokenToSave
    };
    async.series([
        function (cb) {
            switch(userType){
                case APP_CONSTANTS.DATABASE.USER_ROLES.CUSTOMER:
                    Service.CustomerService.updateCustomer(criteria,setQuery,{new:true}, function (err, dataAry) {
                        if (err){
                            cb(err)
                        }else {
                            if (dataAry && dataAry._id){
                                cb();
                            }else {
                                cb(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
                            }
                        }
                    });
                    break;
                case APP_CONSTANTS.DATABASE.USER_ROLES.CONSULTANT:
                    Service.AdminService.updateAdmin(criteria,setQuery,{new:true}, function (err, dataAry) {
                        if (err){
                            cb(err)
                        }else {
                            if (dataAry && dataAry._id){
                                cb();
                            }else {
                                cb(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
                            }
                        }

                    });
                    break;
                case APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN:
                    Service.AdminService.updateAdmin(criteria,setQuery,{new:true}, function (err, dataAry) {
                        if (err){
                            cb(err)
                        }else {
                            if (dataAry && dataAry._id){
                                cb();
                            }else {
                                cb(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
                            }
                        }

                    });
                    break;
                default :
                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
                    break;
            }
        }
    ], function (err, result) {
        if (err){
            callback(err)
        }else {
            callback()
        }

    });
};

var expireTokenInDB = function (userId,userType, callback) {
    var criteria = {
        _id: userId
    };
    var setQuery = {
        accessToken : null
    };
    async.series([
        function (cb) {
            switch(userType){
                case APP_CONSTANTS.DATABASE.USER_ROLES.CUSTOMER :
                    Service.CustomerService.updateCustomer(criteria,setQuery,{new:true}, function (err, dataAry) {
                        if (err){
                            cb(err)
                        }else {
                            if (dataAry && dataAry.length > 0){
                                cb();
                            }else {
                                cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
                            }
                        }
                    });
                    break;
                case APP_CONSTANTS.DATABASE.USER_ROLES.DRIVER :
                    Service.DriverService.updateDriver(criteria,setQuery,{new:true}, function (err, dataAry) {
                        if (err){
                            cb(err)
                        }else {
                            if (dataAry && dataAry.length > 0){
                                cb();
                            }else {
                                cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
                            }
                        }

                    });
                    break;
                case APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN :
                    Service.AdminService.updateAdmin(criteria,setQuery,{new:true}, function (err, dataAry) {
                        if (err){
                            callback(err)
                        }else {
                            if (dataAry && dataAry.length > 0){
                                cb();
                            }else {
                                callback(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
                            }
                        }

                    });
                    break;
                default :
                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);

            }
        }
    ], function (err, result) {
        if (err){
            callback(err)
        }else {
            callback()
        }

    });
};


var verifyToken = function (token, callback) {
    var response = {
        valid: false
    };
    Jwt.verify(token, APP_CONSTANTS.SERVER.JWT_SECRET_KEY, function (err, decoded) {
      //  console.log('jwt err',err,decoded)
        if (err) {
            callback(err)
        } else {
            getTokenFromDB(decoded.id, decoded.type,token, callback);
        }
    });
};

var verifySuperAdminToken = function (token, callback) {
    var response = {
        valid: false
    };
    Jwt.verify(token, APP_CONSTANTS.SERVER.JWT_SECRET_KEY, function (err, decoded) {
        if (err) {
            callback(err)
        } else {

            getSuperAdminTokenFromDB(decoded.id, decoded.type,token, callback);
        }
    });
};


var verifyFleetOwnerToken = function (token, callback) {
    var response = {
        valid: false
    };
    Jwt.verify(token, APP_CONSTANTS.SERVER.JWT_SECRET_KEY, function (err, decoded) {
        if (err) {
            callback(err)
        } else {

            getFleetOwnerTokenFromDB(decoded.id, decoded.type,token, callback);
        }
    });
};

var verifyDriverToken = function (token, callback) {
    var response = {
        valid: false
    };
    Jwt.verify(token, APP_CONSTANTS.SERVER.JWT_SECRET_KEY, function (err, decoded) {
        if (err) {
            callback(err)
        } else {

            getDriverTokenFromDB(decoded.id, decoded.type,token, callback);
        }
    });
};



var setToken = function (tokenData, callback) {
    if (!tokenData.id) {
        callback(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
    } else {
        // var tokenToSend = Jwt.sign(tokenData, APP_CONSTANTS.JWT_SECRET_KEY);
        var tokenToSend = Jwt.sign({username: tokenData.username}, APP_CONSTANTS.JWT_SECRET_KEY);
        setTokenInDB(tokenData.id,tokenData.type, tokenToSend, function (err, data) {
           // console.log('token>>>>',err,data)
            callback(err, {accessToken: tokenToSend})
        })
    }
};

var expireToken = function (token, callback) {
    Jwt.verify(token, APP_CONSTANTS.SERVER.JWT_SECRET_KEY, function (err, decoded) {
        if (err) {
            callback(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN);
        } else {
            expireTokenInDB(decoded.id,decoded.type, function (err, data) {
                callback(err, data)
            });
        }
    });
};

var decodeToken = function (token, callback) {
    Jwt.verify(token, APP_CONSTANTS.SERVER.JWT_SECRET_KEY, function (err, decodedData) {
        if (err) {
            callback(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN);
        } else {
            callback(null, decodedData)
        }
    })
};



var getSuperAdminTokenFromDB = function (userId, userType,token, callback) {
    var userData = null;
    var criteria = {
        _id: userId,
        accessToken : token
    };
    async.series([
        function (cb) {
            if (userType == APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN){
                Service.AdminService.getAdmin(criteria,{},{lean:true}, function (err, dataAry) {
                    if (err){
                        cb(err)
                    }else {
                        if (dataAry && dataAry.length > 0){
                            userData = dataAry[0];
                            cb();
                        }else {
                            cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
                        }
                    }

                });

            }else {
                cb(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
            }
        }
    ], function (err, result) {
        if (err){
            callback(err)
        }else {
            if (userData && userData._id){
                userData.id = userData._id;
                userData.type = userType;
            }
            callback(null,{userData: userData})
        }

    });
};

var getFleetOwnerTokenFromDB = function (userId, userType,token, callback) {
    var userData = null;
    var criteria = {
        _id: userId,
        accessToken : token
    };
    async.series([
        function (cb) {
            if (userType == APP_CONSTANTS.DATABASE.USER_ROLES.FLEET_OWNER){
                Service.FleetOwnerService.getFleetOwner(criteria,{},{lean:true}, function (err, dataAry) {
                    if (err){
                        cb(err)
                    }else {
                        if (dataAry && dataAry.length > 0){
                            userData = dataAry[0];
                            cb();
                        }else {
                            cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
                        }
                    }

                });

            }else {
                cb(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
            }
        }
    ], function (err, result) {
        if (err){
            callback(err)
        }else {
            if (userData && userData._id){
                userData.id = userData._id;
                userData.type = userType;
            }
            callback(null,{userData: userData})
        }

    });
};

var getDriverTokenFromDB = function (userId, userType,token, callback) {
    var userData = null;
    var criteria = {
        _id: userId,
        accessToken : token
    };
    async.series([
        function (cb) {
            if (userType == APP_CONSTANTS.DATABASE.USER_ROLES.DRIVER){
                Service.DriverService.getDriver(criteria,{},{lean:true}, function (err, dataAry) {
                    if (err){
                        cb(err)
                    }else {
                        if (dataAry && dataAry.length > 0){
                            userData = dataAry[0];
                            cb();
                        }else {
                            cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
                        }
                    }

                });

            }else {
                cb(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
            }
        }
    ], function (err, result) {
        if (err){
            callback(err)
        }else {
            if (userData && userData._id){
                userData.id = userData._id;
                userData.type = userType;
            }
            callback(null,{userData: userData})
        }

    });
};

module.exports = {
    expireToken: expireToken,
    setToken: setToken,
    verifyToken: verifyToken,
    decodeToken: decodeToken,
    verifySuperAdminToken:verifySuperAdminToken,
    getSuperAdminTokenFromDB:getSuperAdminTokenFromDB,
    verifyFleetOwnerToken:verifyFleetOwnerToken,
    getDriverTokenFromDB:getDriverTokenFromDB,
    verifyDriverToken:verifyDriverToken
};