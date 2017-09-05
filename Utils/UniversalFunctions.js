/**
 * Created by shahab on 10/7/15.
 */
var Joi = require('joi');
var async = require('async');
var MD5 = require('md5');
var Boom = require('boom');
var CONFIG = require('../Config');
var APP_CONSTANTS = require('../Config/appConstants');
var Models = require('../Model');
var randomstring = require("randomstring");

//var NotificationManager = require('../Lib/NotificationManager');
var validator = require('validator');






var sendError = function (data) {
    console.trace('ERROR OCCURED ', data)
    if (typeof data == 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('customMessage')) {
        console.log('attaching resposnetype',data.type)
        var errorToSend = Boom.create(data.statusCode, data.customMessage);
        errorToSend.output.payload.responseType = data.type;
        return errorToSend;
    } else {
        var errorToSend = '';
        if (typeof data == 'object') {
            if (data.name == 'MongoError') {
                errorToSend += APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage;
                if (data.code = 11000) {
                    var duplicateValue = data.errmsg && data.errmsg.substr(data.errmsg.lastIndexOf('{ : "') + 5);
                    duplicateValue = duplicateValue.replace('}','');
                    errorToSend += APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE.customMessage + " : " + duplicateValue;
                    if (data.message.indexOf('customer_1_streetAddress_1_city_1_state_1_country_1_zip_1')>-1){
                        errorToSend = APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE_ADDRESS.customMessage;
                    }
                }
            } else if (data.name == 'ApplicationError') {
                errorToSend += APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + ' : ';
            } else if (data.name == 'ValidationError') {
                errorToSend += APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + data.message;
            } else if (data.name == 'CastError') {
                errorToSend += APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage + APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID.customMessage + data.value;
            }
        } else {
            errorToSend = data
        }
        var customErrorMessage = errorToSend;
        if (typeof customErrorMessage == 'string'){
            if (errorToSend.indexOf("[") > -1) {
                customErrorMessage = errorToSend.substr(errorToSend.indexOf("["));
            }
            customErrorMessage = customErrorMessage && customErrorMessage.replace(/"/g, '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace('[', '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace(']', '');
        }
        return Boom.create(400,customErrorMessage)
    }
};

var sendSuccess = function (successMsg, data) {
    successMsg = successMsg || APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT.customMessage;
    if (typeof successMsg == 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {
        return {status:successMsg.statusCode, message: successMsg.customMessage, data: data || null};

    }else {
        return {status:200, message: successMsg, data: data || null};

    }
};

var checkDuplicateValuesInArray = function (array) {

    var storeArray = [];
    var duplicateFlag = false;
    if(array && array.length>0){
        for (var i=0; i<array.length;i++){
            if (storeArray.indexOf(array[i]) == -1){

                storeArray.push(array[i])
            }else {

                duplicateFlag = true;
                break;
            }
        }
    }
    storeArray = [];
    return duplicateFlag;
};

var failActionFunction = function (request, reply, source, error) {
    var customErrorMessage = '';
    if (error.output.payload.message.indexOf("[") > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
    } else {
        customErrorMessage = error.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    error.output.payload.message = customErrorMessage;
    delete error.output.payload.validation
    return reply(error);
};


var customQueryDataValidations = function (type,key, data, callback) {
    var schema = {};
    switch(type){
        case 'PHONE_NO' : schema[key] = Joi.string().regex(/^[0-9]+$/).length(10);
            break;
        case 'NAME' : schema[key] = Joi.string().regex(/^[a-zA-Z ]+$/).min(2);
            break;
        case 'BOOLEAN' : schema[key] = Joi.boolean();
            break;
    }
    var value = {};
    value[key] = data;

    Joi.validate(value, schema, callback);
};


var authorizationHeaderObj = Joi.object({
    authorization: Joi.string().required()
}).unknown();

var getEmbeddedDataFromMongo = function (dataAry, keyToSearch, referenceIdToSearch, embeddedFieldModelName, variableToAttach, callback) {
    if (!dataAry || !keyToSearch || !variableToAttach || !embeddedFieldModelName || !Models[embeddedFieldModelName]) {
        callback(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
    } else {
        if (dataAry.length > 0) {
            var taskToRunInParallel = [];
            dataAry.forEach(function (dataObj) {
                taskToRunInParallel.push((function (dataObj) {
                    return function (embeddedCB) {
                        if (!dataObj[referenceIdToSearch]) {
                            callback(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
                        } else {
                            var criteria = {};
                            criteria[keyToSearch] = dataObj[referenceIdToSearch];
                            Models[embeddedFieldModelName].find(criteria, function (err, modelDataAry) {
                                if (err) {
                                    embeddedCB(err)
                                } else {
                                    if (modelDataAry) {
                                        dataObj[variableToAttach] = modelDataAry
                                    }
                                    embeddedCB()
                                }
                            })
                        }

                    }
                })(dataObj));
            });

            async.parallel(taskToRunInParallel, function (err, result) {
                if (err) {
                    callback(err)
                } else {
                    callback(null, dataAry)
                }
            })

        } else {
            callback(null, dataAry)
        }
    }
};

var CryptData = function (stringToCrypt) {
    return (MD5(stringToCrypt));
};

var generateRandomString = function () {
    return randomstring.generate(7);
};

var filterArray = function (array) {
    return array.filter(function (n) {
        return n != undefined && n != ''
    });
};

var sanitizeName = function (string) {
    return filterArray(string && string.split(' ') || []).join(' ')
};

var verifyEmailFormat = function (string) {
    return validator.isEmail(string)
};

var getFileNameWithUserId = function (thumbFlag, fullFileName, userId) {
    var prefix = APP_CONSTANTS.DATABASE.PROFILE_PIC_PREFIX.ORIGINAL;
    var ext = fullFileName && fullFileName.length > 0 && fullFileName.substr(fullFileName.lastIndexOf('.') || 0, fullFileName.length);
    if (thumbFlag) {
        prefix = APP_CONSTANTS.DATABASE.PROFILE_PIC_PREFIX.THUMB;
    }
    return prefix + userId + ext;
};

var getFileNameWithUserIdWithCustomPrefix = function (thumbFlag, fullFileName,type, userId) {
    var prefix = '';
    if (type == APP_CONSTANTS.DATABASE.USER_ROLES.DRIVER){
        prefix = APP_CONSTANTS.DATABASE.DRIVER;
    }else if (type == APP_CONSTANTS.DATABASE.USER_ROLES.CUSTOMER){
        prefix = APP_CONSTANTS.DATABASE.CUSTOMER;
    } else {
        prefix =APP_CONSTANTS.DATABASE.OTHER;
    }
    var ext = fullFileName && fullFileName.length > 0 && fullFileName.substr(fullFileName.lastIndexOf('.') || 0, fullFileName.length);
    if (thumbFlag && type == APP_CONSTANTS.DATABASE.FILE_TYPES.LOGO) {
        prefix = APP_CONSTANTS.DATABASE.LOGO_PREFIX.THUMB;
    }
    var ranNum = randomstring.generate(6);
    return prefix + ranNum + userId + ext;
};



var deleteUnnecessaryUserData = function (userObj) {
    //console.log('deleting>>',userObj)
    delete userObj['__v'];
    delete userObj['password'];
    delete userObj['accessToken'];
    delete userObj['emailVerificationToken'];
    delete userObj['passwordResetToken'];
    delete userObj['registrationDate'];
    delete userObj['OTPCode'];
    delete userObj['facebookId'];
    delete userObj['codeUpdatedAt'];
    delete userObj['deviceType'];
    delete userObj['deviceToken'];
    delete userObj['appVersion'];
    delete userObj['isBlocked'];
    //console.log('deleted',userObj)
    return userObj;
};


var generateRandomStringNumber = function stringGen(len)
{
    var text = "";

    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}


module.exports = {
    sendError: sendError,
    sendSuccess: sendSuccess,
    checkDuplicateValuesInArray: checkDuplicateValuesInArray,
    CryptData: CryptData,
    failActionFunction: failActionFunction,
 //   NotificationManager: NotificationManager,
    authorizationHeaderObj: authorizationHeaderObj,
    getEmbeddedDataFromMongo: getEmbeddedDataFromMongo,
    verifyEmailFormat: verifyEmailFormat,
    sanitizeName: sanitizeName,
    deleteUnnecessaryUserData: deleteUnnecessaryUserData,
    filterArray: filterArray,
    CONFIG: CONFIG,
    generateRandomString: generateRandomString,
    getFileNameWithUserId : getFileNameWithUserId,
    getFileNameWithUserIdWithCustomPrefix : getFileNameWithUserIdWithCustomPrefix,
    customQueryDataValidations : customQueryDataValidations,
    generateRandomStringNumber:generateRandomStringNumber
};