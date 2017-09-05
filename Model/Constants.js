var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../Config');

var Constants = new Schema({
    constantValue: { type: String },
    constantType : {type: String},
    createdAt: {type: Date,default: Date.now },
    modifiedAt: {type: Date}
});


module.exports = mongoose.model('Constants', Constants);