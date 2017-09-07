var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var APP_CONSTANTS = require('../Config/appConstants');
var Config = require('../Config');

var Waterlog = new Schema({
    userId:   { type: Schema.ObjectId, ref: 'Customers' },
    AwakeDate:{type: Date, default: Date.now, required: true},
    AwakeTime:{type: Date, default: Date.now, required: true},
    SleepDate:{type: Date, default: Date.now, required: true},
    SleepTime:{type: Date, default: Date.now, required: true},
    TimeDifference: {type: String, default: ''}   
});

module.exports = mongoose.model('Waterlog', Waterlog);