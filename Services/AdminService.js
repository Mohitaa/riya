'use strict';

var Models = require('../Model');

//Get Users from DB
var getAdmin = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.Admins.find(criteria, projection, options, callback);
};

//Insert User in DB
var createAdmin = function (objToSave, callback) {
    new Models.Admins(objToSave).save(callback)
};

//Update User in DB
var updateAdmin = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    options.multi = true;
    Models.Admins.findOneAndUpdate(criteria, dataToSet, options, callback);
};

var updateArray = function (criteria, dataToSet, options, callback) {
    options.multi = true;
    Models.Admins.update(criteria, dataToSet, options, callback);
};
var resgisterConsultant = function (objToSave, callback) {
    new Models.Admins(objToSave).save(callback)
};
var countAdmins = function (criteria, callback) {
    Models.Admins.count(criteria, callback);
};
//Delete User in DB
var deleteAdminbyId= function (criteria, callback) {
    Models.Admins.deleteOne(criteria, callback);
};

var getAggregatecount=function(criteria,callback){
    Models.Admins.aggregate(criteria,callback);
}
module.exports = {
    getAdmin: getAdmin,
    createAdmin: createAdmin,
    updateAdmin: updateAdmin,
    updateArray:updateArray,
    countAdmins:countAdmins,
    deleteAdminbyId:deleteAdminbyId,
    getAggregatecount:getAggregatecount
    // resgisterConsultant:resgisterConsultant
};

