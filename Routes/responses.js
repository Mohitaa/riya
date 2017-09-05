var constants = require('./constants');

exports.parameterMissingResponse = function (res) {
    console.log("check");
    var response = {
        "message": constants.responseMessages.PARAMETER_MISSING,
        "status": constants.responseFlags.PARAMETER_MISSING,
        "data" : {}
    };
    res.send(JSON.stringify(response));
};

exports.authenticationErrorResponse = function (res){
    var response = {
        "message": constants.responseMessages.INVALID_ACCESS_TOKEN,
        "status": constants.responseFlags.INVALID_ACCESS_TOKEN,
        "data" : {}
    };
    res.send(JSON.stringify(response));
};

exports.sendError = function (res) {
    var response = {
        "message": constants.responseMessages.ERROR_IN_EXECUTION,
        "status": constants.responseFlags.ERROR_IN_EXECUTION,
        "data" : {}
    };
    res.send(JSON.stringify(response));
};