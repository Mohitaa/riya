
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var APP_CONSTANTS = require('../Config/appConstants');
var Config = require('../Config');
var chalk = require('chalk');
var bcrypt=require('bcrypt');
var SALT_WORK_FACTOR = 10;
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection(Config.dbConfig.uri);
autoIncrement.initialize(connection);

var card = new Schema({
    last4Digit : {type : String, required:true, length:4},
    stripeId : {type : String, required:true},  //basically card id
    cardType: { type: String, required: true  },
    isDefault: {type: Boolean, default: false},
    cardFingerPrints: { type: String, required: true  },
    createdAt: { type: Date, default: Date.now }
});
var Admins = new Schema({
    name: {type: String, trim: true, index: true, default: null, sparse: true},
    email: {type: String, trim: true, unique: true, index: true},
    userType: {type: Number,default:1,required:true},
    accessToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    password: {type: String, required:true},
    passwordResetToken: {type: String, trim: true, unique: true, sparse:true},
    registrationDate: {type: Date, default: Date.now, required: true},
    countryCode: {type: String,sparse:true, required: true,default: "+91", trim: true, min:2, max:5},
    phoneNo: {type: String, sparse:true, trim: true, unique: true, min: 5, max: 15},
    newNumber: {type: String, trim: true, sparse: true, index: true, unique: true, min: 5, max: 15},
    social: {
        socialMode: {type: String, enum: [ APP_CONSTANTS.DATABASE.SOCIAL.FACEBOOK,APP_CONSTANTS.DATABASE.SOCIAL.LINKED_IN,APP_CONSTANTS.DATABASE.SOCIAL.GOOGLE_PLUS,APP_CONSTANTS.DATABASE.SOCIAL.TWITTER ]},
        socialId: { type: String }
    },
    firstTimeLogin: {type: Boolean, default: false},
    OTPCode: {type: String, trim: true, unique: true, sparse: true, index: true},
    emailVerificationToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    deviceToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    deviceType: {
        type: String, enum: [
            APP_CONSTANTS.DATABASE.DEVICE_TYPES.IOS,
            APP_CONSTANTS.DATABASE.DEVICE_TYPES.ANDROID
        ]
    },
    ConsultantType: {type: String},
    pinCode: {type: String},
    cards: { type: [card], default: [] },
    stripeCustomerId:{type: String},
    isBlocked: {type: Number, default: 0, required: true},
    isDeleted: {type: Boolean, default: false, required: true},
    emailVerified: {type: Boolean, default: false, required: true},
    phoneVerified: {type: Boolean, default: false, required: true},
    profilePicURL: {
        original: {type: String, default: null},
        thumbnail: {type: String, default: null}
    },
    workExperience:{
        companyName: {type: String, trim: true},
        position:{type: String, trim: true},
        fromDate: {type: Date},
        toDate: {type: Date},
        duration:{type: String, trim: true},
        companyName1: {type: String, trim: true},
        position1:{type: String, trim: true},
        fromDate1: {type: Date,sparse:true},
        toDate1: {type: Date,sparse:true},
        duration1:{type: String, trim: true},
        companyName2: {type: String, trim: true},
        position2:{type: String, trim: true},
        fromDate2: {type: Date,sparse:true},
        toDate2: {type: Date,sparse:true},
        duration2:{type: String, trim: true}
    },
    userId:[],
    extraCertification:{type: String, trim: true, index: true},
    totalRating: {type: Number,default: 0},
    usersRated: { type: Number,default: 0}    


});

Admins.plugin(autoIncrement.plugin, {model: 'Admins', field: 'AdminNumericId', startAt: 10000});
module.exports = mongoose.model('Admins', Admins);