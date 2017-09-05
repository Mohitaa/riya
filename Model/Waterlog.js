var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var APP_CONSTANTS = require('../Config/appConstants');
var Config = require('../Config');

var Waterlog = new Schema({
    userId:   { type: Schema.ObjectId, ref: 'Customers' },
    logdate:{type: Date, default: Date.now, required: true},
    wateramount:{type: String, trim: true, index: true, default: null, sparse: true},
    dateTime: {type: String, default: ''}
   
});

module.exports = mongoose.model('Waterlog', Waterlog);