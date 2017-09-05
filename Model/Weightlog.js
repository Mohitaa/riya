var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var APP_CONSTANTS = require('../Config/appConstants');
var Config = require('../Config');

var Weightlog = new Schema({
    userId:   { type: Schema.ObjectId, ref: 'Customers' },
    logdate:{type: Date, default: Date.now, required: true},
    Weight:{type: String, trim: true, index: true, default: null, sparse: true},
    dateTime: {type: String, default: ''}
   
});

module.exports = mongoose.model('Weightlog', Weightlog);