'use strict';

var Models = require('../Model');

//Get Users from DB
var getPromo = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.Promo.find(criteria, projection, options, callback);
};



//Get One Promo from DB
var getOnePromo = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.Promo.findOne(criteria, projection, options, callback);
};



//Get All Generated Codes from DB
var getAllGeneratedCodes = function (callback) {
    var criteria = {
        OTPCode : {$ne : null}
    };
    var projection = {
        OTPCode : 1
    };
    var options = {
        lean : true
    };
    Models.Promo.find(criteria,projection,options, function (err, dataAry) {
        if (err){
            callback(err)
        }else {
            var generatedCodes = [];
            if (dataAry && dataAry.length > 0){
                dataAry.forEach(function (obj) {
                    generatedCodes.push(obj.OTPCode.toString())
                });
            }
            callback(null,generatedCodes);
        }
    })
};

//Insert User in DB
var createPromo = function (objToSave, callback) {
    new Models.Promo(objToSave).save(callback)
};

//Update User in DB
var updatePromo = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.Promo.findOneAndUpdate(criteria, dataToSet, options, callback);
};

//Delete User in DB
var deletePromo = function (criteria, callback) {
    Models.Promo.findOneAndRemove(criteria, callback);
};


var getAndPopulatePromo = function (query,projection,option,populateQuery, callback) {

    Models.Promo.find(query, projection, option).populate(populateQuery).exec( function (err, data) {

        if (err) {

            callback(err);
        }
        else {
            callback(null, data);
        }
    })
};

module.exports = {
    getPromo: getPromo,
    getAllGeneratedCodes: getAllGeneratedCodes,
    updatePromo: updatePromo,
    deletePromo: deletePromo,
    createPromo: createPromo,
    getOnePromo:getOnePromo,
    getAndPopulatePromo:getAndPopulatePromo
};

