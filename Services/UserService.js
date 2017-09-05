'use strict';

var Models = require('../Model');

//Get Users from DB
var getUser = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.Customers.find(criteria, projection, options, callback);
};

//Insert User in DB
var createUser = function (objToSave, callback) {
    new Models.Customers(objToSave).save(callback)
};

//Update User in DB
var updateUser = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.Customers.findOneAndUpdate(criteria, dataToSet, options, callback);
};
var resgisterConsultant = function (objToSave, callback) {
    new Models.Customers(objToSave).save(callback)
};
var countUsers = function (criteria, callback) {
    Models.Customers.count(criteria, callback);
};
//Delete User in DB
var deleteUserbyId= function (criteria, callback) {
    Models.Customers.deleteOne(criteria, callback);
};

var getAndPopulateUser = function (query,projection,option,populateQuery, callback) {

    Models.Customers.find(query, projection, option).populate(populateQuery).exec( function (err, data) {

        if (err) {

            callback(err);
        }
        else {
            callback(null, data);
        }
    })
};


module.exports = {
    getUser: getUser,
    createUser: createUser,
    updateUser: updateUser,
    countUsers:countUsers,
    deleteUserbyId:deleteUserbyId,
    getAndPopulateUser:getAndPopulateUser
    // resgisterConsultant:resgisterConsultant
};

