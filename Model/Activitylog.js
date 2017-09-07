var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var APP_CONSTANTS = require('../Config/appConstants');
var Config = require('../Config');

var Waterlog = new Schema({
    userId:   { type: Schema.ObjectId, ref: 'Customers' },
    Date:{type: Date, default: Date.now, required: true},
    Time:{type: Date, default: Date.now, required: true},
    activityname:{type:String,required:true},
    calories:{type:String,required:true},
    description:{type:String,required:true},
    km:{type:String,required:true,sparse:true},

    nworkouttime: {type: String, default: ''}   
});

module.exports = mongoose.model('Waterlog', Waterlog);