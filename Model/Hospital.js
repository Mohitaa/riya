var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../Config');

var Hospital = new Schema({
    
    name: {type: String, trim: true, index: true, default: null, sparse: true},
    address: {type: String, trim: true, index: true, default: null, sparse: true},
    city: {type: String, trim: true, index: true, default: null, sparse: true},
    state: {type: String, required: true, trim: true,default: null, sparse: true},
    country: {type: String, required: true, trim: true,default: null, sparse: true},
    pin_code: {type: String, required: true, trim: true,default: null, sparse: true},
    profilePicURL: {
        original: {type: String, default: null},
        thumbnail: {type: String, default: null}
    }
});


module.exports = mongoose.model('Hospital', Hospital);