'use strict';

var Models = require('../Model');

//Get Users from DB
var getPlan = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.Plans.find(criteria, projection, options, callback);
};

//Insert User in DB
var addPlan = function (objToSave, callback) {
    new Models.Plans(objToSave).save(callback)
};

//Update User in DB
var updatePlans = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.Plans.findOneAndUpdate(criteria, dataToSet, options, callback);
};
var countPlans = function (criteria, callback) {
    Models.Plans.count(criteria, callback);
};
//Delete User in DB
var deletePlanbyId= function (criteria, callback) {
    Models.Plans.deleteOne(criteria, callback);
};


module.exports = {
    getPlan: getPlan,
    addPlan: addPlan,
    updatePlans: updatePlans,
    countPlans:countPlans,
    deletePlanbyId:deletePlanbyId
};

