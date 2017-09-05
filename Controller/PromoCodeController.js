var UniversalFunctions = require('../Utils/UniversalFunctions');
var async = require('async');
var Service = require('../Services');
var commonFunc = require('../Routes/commonfunction');
var APP_CONSTANTS = require('../Config/appConstants');
var winston = require('winston');
var constants = require('./constants');


var getAllPromoCode = function(access_token,data,callback){

    var limit = parseInt(data.limit);
    var skip =parseInt(data.skip);
     var userDataToSend = null, promoCodeCount=0;
       async.series([
        function (cb) {
        var getCriteria = {
            accessToken: access_token
        };

            Service.AdminService.getAdmin(getCriteria, {}, { }, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                if (data && data.length > 0 ) {
                    isauth=true;
                    cb()
                } else {
                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_USER_PASS)
                }
            }
        });
    }, 
     function(cb){

                var criteria={ 
                       isDeleted:false
                };
                var projection = {};
                var option = {
                    limit:limit || 0,
                    skip: skip || 0,
                    sort: {createdAt: -1}
                }
                Service.PromoService.getPromo(criteria, projection, option,function(err,getPromoCode){
                    if(err){
                        cb(err);
                    }
                    // else if(!getPromoCode || !getPromoCode.length){
                    //     cb(APP_CONSTANTS.STATUS_MSG.ERROR.NOT_FOUND)
                    // }
                    else{
                        userDataToSend = getPromoCode;
                        winston.info("valid");
                        cb();
                    }
                })
            }, function (cb) {
        if (isauth) {
            var criteria={isDeleted:false};
            var projection = {};
            var option = {
                    limit: limit || 0,
                    skip: skip || 0,
                    sort: {createdAt: -1}
                }            
         Service.PromoService.getPromo(criteria, projection, option, function (err, getPromoCode) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                if(getPromoCode)
                {
                    
                     promoCodeCount = getPromoCode.length;;
                }
                cb();
                
            }
        });

        } 

    }], function (err, data) {
        console.log('sending response',data)
       
       if (err) {
            callback(err);
        } else {
               
            callback(null,{promoCodeList:userDataToSend ,listCount:promoCodeCount})
        }

    });
   


}
var createPromoCode = function(access_token,data,callback){

      var dataToSend = null;
      data.name =data.name.toUpperCase();;
       async.series([
        function (cb) {
        var getCriteria = {
            accessToken: access_token
        };

            Service.AdminService.getAdmin(getCriteria, {}, { }, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                if (data && data.length > 0 ) {
                    isauth=true;
                    cb()
                } else {
                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_USER_PASS)
                }
            }
        });
    }, 
     function(cb){

                var criteria={ 
                       isDeleted:false,
                       name :data.name
                };
                Service.PromoService.getPromo(criteria, { __v: 0},{}, function(err,result){
                    if(err){
                        cb(err);
                    }
                    else if(result && result.length > 0){
                       return cb(APP_CONSTANTS.STATUS_MSG.ERROR.PROMO_CODE_EXIST);
                    }
                    else{

                        cb(err,result);
                    }
                })
            }, function (cb) {
        if (isauth) {
            data.leftLimit=data.globalUsageLimit;         
         Service.PromoService.createPromo(data, function (err, result) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                   dataToSend = result
                cb(null,result);
                
            }
        });

        } 

    }], function (err, results) {
        console.log('sending response',results)
       
       if (err) {
            callback(err);
        } else {
               
            callback(null,dataToSend)
        }

    });
   


}


var deletePromoCode = function(access_token,data,callback){

    var promoid=data.promoId;
    var dataToSend=null;
       async.series([
        function (cb) {
        var getCriteria = {
            accessToken: access_token
        };

            Service.AdminService.getAdmin(getCriteria, {}, { }, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                if (data && data.length > 0 ) {
                    isauth=true;
                    cb()
                } else {
                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_USER_PASS)
                }
            }
        });
    }, 
    function (cb) {
        if (isauth) {
             var criteria={ 
                      _id :promoid
                };         
         Service.PromoService.deletePromo(criteria, function (err, result) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                   dataToSend = result
                cb(null,result);
                
            }
        });

        } 

    }], function (err, results) {
        console.log('sending response',results)
       
       if (err) {
            callback(err);
        } else {
               
            callback(null,dataToSend)
        }

    });
   


}


var editPromoCode = function(access_token,data,callback){

      data.name =data.name.toUpperCase();;
    var dataToSend=null;
       async.series([
        function (cb) {
        var getCriteria = {
            accessToken: access_token
        };

            Service.AdminService.getAdmin(getCriteria, {}, { }, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                if (data && data.length > 0 ) {
                    isauth=true;
                    cb()
                } else {
                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_USER_PASS)
                }
            }
        });
    }, 
    function (cb) {
        if (isauth) {
             var criteria={ 
                      _id :data._id
                };     
                var dataToSet ={
                    "name" :data.name,
                    "value" : data.maxDiscountAmt,
                    "expiryDate" : data.endTime,
                    "description" : data.description,
                    "startDate" : data.startTime,
                    "leftLimit" : data.frequency,
                    "globalUsageLimit" : data.frequency_per_user,
                    "valueType" : data.valueType
                    
                }  
                var  options = {
                    new: true
                }  
         Service.PromoService.updatePromo(criteria,dataToSet,options, function (err, result) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                   dataToSend = result
                cb(null,result);
                
            }
        });

        } 

    }], function (err, results) {
        console.log('sending response',results)
       
       if (err) {
            callback(err);
        } else {
               
            callback(null,dataToSend)
        }

    });
   


}

module.exports={
    getAllPromoCode:getAllPromoCode,
    createPromoCode:createPromoCode,
    deletePromoCode:deletePromoCode,
    editPromoCode:editPromoCode
  
}