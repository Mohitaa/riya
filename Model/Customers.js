var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var APP_CONSTANTS = require('../Config/appConstants');
var autoIncrement = require('mongoose-auto-increment');
var Config = require('../Config');

var card = new Schema({
    last4Digit : {type : String, required:true, length:4},
    stripeId : {type : String, required:true},  //basically card id
    cardType: { type: String, required: true  },
    isDefault: {type: Boolean, default: false},
    cardFingerPrints: { type: String, required: true  },
    createdAt: { type: Date, default: Date.now }
});

var Customers = new Schema({
    
    activityperweek:{type:String, trim: true, unique: true, index: true, sparse: true},
    consultantId:   { type: Schema.ObjectId, ref: 'Admins' },
    alergy:{type:String, trim: true, unique: true, index: true, sparse: true},
    bmi:{type:String, trim: true, unique: true, index: true, sparse: true},
    gender:{type:String, default:APP_CONSTANTS.DATABASE.GENDER.MALE,enum: [APP_CONSTANTS.DATABASE.GENDER.FEMALE ,APP_CONSTANTS.DATABASE.GENDER.MALE]},
    medicahistory:{type:String, trim: true, unique: true, index: true, sparse: true},
    weight:{type:String, trim: true, unique: true, index: true, sparse: true},
    firstName: {type: String, trim: true, index: true, default: null, sparse: true},
    lastName: {type: String, trim: true, index: true, default: null, sparse: true},
    countryCode: {type: String, required: true, trim: true, min:2, max:5},
    phoneNo: {type: String, required: true, trim: true, index: true, unique: true, min: 5, max: 15},
    newNumber: {type: String, trim: true, sparse: true, index: true, unique: true, min: 5, max: 15},
    social: {
        socialMode: {type: String, enum: [ APP_CONSTANTS.DATABASE.SOCIAL.FACEBOOK,APP_CONSTANTS.DATABASE.SOCIAL.LINKED_IN,APP_CONSTANTS.DATABASE.SOCIAL.GOOGLE_PLUS,APP_CONSTANTS.DATABASE.SOCIAL.TWITTER ]},
        socialId: { type: String }
    },
    email: {type: String, trim: true, unique: true, index: true, required: true},
    codeUpdatedAt: {type: Date, default: Date.now, required: true},
    firstTimeLogin: {type: Boolean, default: false},
    language: {
        type: String, required: true,
        default : APP_CONSTANTS.DATABASE.LANGUAGE.ES_MX,
        enum: [
            APP_CONSTANTS.DATABASE.LANGUAGE.EN,
            APP_CONSTANTS.DATABASE.LANGUAGE.ES_MX
        ]
    },
    Age:{type:String},
    password: {type: String,required: true},
    passwordResetToken: {type: String, trim: true, unique: true, index: true, sparse: true},
    registrationDate: {type: Date, default: Date.now, required: true},
    appVersion: {type: String},
    OTPCode: {type: String, trim: true, unique: true, sparse: true, index: true},
    accessToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    emailVerificationToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    deviceToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    deviceType: {
        type: String, enum: [
            APP_CONSTANTS.DATABASE.DEVICE_TYPES.IOS,
            APP_CONSTANTS.DATABASE.DEVICE_TYPES.ANDROID
        ]
    },
    cards: { type: [card], default: [] },
    stripeCustomerId:{type: String},
    dotNumber:{type: String},
    isBlocked: {type: Boolean, default: false, required: true},
    isDeleted: {type: Boolean, default: false, required: true},
    emailVerified: {type: Boolean, default: false, required: true},
    phoneVerified: {type: Boolean, default: false, required: true},
    defaultAddressId : {type: String, default:null},
    address: { type: String, default:null
    },
    profilePicURL: {
        original: {type: String, default: null},
        thumbnail: {type: String, default: null}
    },
    proofOfInsurance:{type: String},
    totalRating: {type: Number,default: 0},
    usersRated: { type: Number,default: 0}
});
Customers.plugin(autoIncrement.plugin, {model: 'Customers', field: 'userId', startAt: 100});
module.exports = mongoose.model('Customers', Customers);