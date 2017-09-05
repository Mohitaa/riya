'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../Config');

const Promo = new Schema({
    name                :   { type : String, required : true, index : true },
    valueType           :   { type : String , enum :[ "PERCENT",'AMOUNT' ],default :"PERCENT"},
    value               :   { type: Number, required: true },
    type                :   { type : String , enum : ["FIRST_BOOKING", "REGULAR" ] },
    //isCustomerSpecific:   { type : Boolean, default : false},
    globalUsageLimit    :   { type: Number,default : -1 },
    leftLimit           :   { type: Number,default : 0 },
    perCustomerUsage    :   { type : Number, default : -1 },
    expiryDate          :   { type: Date , required: true },
    startDate           :   { type: Date , required: true , default : Date.now },
    isDeleted           :   { type: Boolean, default: false },
    description         :   { type : String },
    //users             : [ { type : mongoose.Schema.Types.ObjectId, ref:'User'  } ],
    createdAt           :   { type : Date, default : Date.now },
    updatedAt           :   { type : Date, default : Date.now }

});

module.exports = mongoose.model('Promo', Promo);