var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var APP_CONSTANTS = require('../Config/appConstants');
var Config = require('../Config');

var Foodlog = new Schema({
    userId:   { type: Schema.ObjectId, ref: 'Customers' },
    logdate:{type: Date, default: Date.now, required: true},
    foodName:{type: String, trim: true, index: true, default: null, sparse: true},
    Quantity:{type: String, trim: true, index: true, default: null, sparse: true},
    Type:{type: String, trim: true, index: true, default: null, sparse: true},
     dateTime: {type: String, default: ''}
   
});

module.exports = mongoose.model('Foodlog', Foodlog);