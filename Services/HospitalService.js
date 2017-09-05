'use strict';

var Models = require('../Model');

//Get Users from DB
var getDriver = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.Hospital.find(criteria, projection, options, callback);
};

//Insert User in DB
var createDriver = function (objToSave, callback) {
    new Models.Hospital(objToSave).save(callback)
};

//Update User in DB
var updateDriver = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.Hospital.findOneAndUpdate(criteria, dataToSet, options, callback);
};

//Delete User in DB
var deleteDriver= function (criteria, callback) {
    Models.Hospital.findOneAndRemove(criteria, callback);
};




module.exports = {
    getDriver: getDriver,
    updateDriver: updateDriver,
    deleteDriver: deleteDriver,
    createDriver: createDriver,

};

