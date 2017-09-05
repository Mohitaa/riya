var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../Config');

var Plan = new Schema({
    planName: {type: String, trim: true, index: true, default: null, sparse: true},
    price: {type: String, trim: true},
    duration: {type: String,default:1,required:true},
    category: {type: String, trim: true},
    services: {type: String, trim: true}
});


module.exports = mongoose.model('Plans', Plan);
