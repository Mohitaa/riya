var UniversalFunctions = require('../Utils/UniversalFunctions');
var async = require('async');
var Service = require('../Services');
var commonFunc = require('../Routes/commonfunction');
var APP_CONSTANTS = require('../Config/appConstants');
var winston = require('winston');
var constants = require('./constants');
var UploadManager = require('../Lib/UploadManager');


// add plan for different
var addHospital = function(request, callback) {
    var name =request.body.name;
    var address=request.body.address;
    var city=request.body.city;
    var state=request.body.state;
    var country=request.body.country;
    var pin_code=request.body.pin_code;
    var access_token=request.body.access_token;
    var dataToSave = request.body;
    var profilePic=request.files[0];
    var driverData = null;
    console.log(access_token,request.body);
    var isauth =false;
    var dataToUpdate = {};
    if (profilePic && profilePic.originalname) {
        dataToUpdate.profilePicURL = {
            original: null,
            thumbnail: null
        }
    }
     async.series([
        function (cb) {
        var getCriteria = {
            accessToken: access_token
        };
        console.log("criteria",getCriteria)
        Service.AdminService.getAdmin(getCriteria, {}, {}, function (err, data) {
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
    }, function (cb) {
             Service.HospitalService.createDriver(dataToSave, function (err, dataFromDB) {
               console.log('customeized erro',err,dataFromDB)
                if (err) {
                    if (err.code == 11000 && err.message.indexOf('drivers.$phoneNo_1') > -1){
                        cb(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.PHONE_NO_EXIST);

                    } else if (err.code == 11000 && err.message.indexOf('drivers.$email_1') > -1){
                        cb(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_ALREADY_EXIST);

                    }else {
                        cb(err)
                    }
                } else {
                    console.log('setting driver',driverData)
                    driverData = dataFromDB;
                    console.log('setting driver',driverData)
                    cb(null,driverData);
                }
            })       


    },        function (cb) {
            //Check if profile pic is being updated
            console.log("asd  "+driverData +" "+ driverData._id +" "+ profilePic +" "+ profilePic.originalname)
            if (driverData && driverData._id && profilePic && profilePic.originalname) {
                console.log(driverData && driverData._id && profilePic && profilePic.originalname )
                UploadManager.uploadFile(profilePic, driverData._id,1, function (err, uploadedInfo) {
                    console.log('update profile pic',err,uploadedInfo)
                    if (err) {
                        cb(err)
                        console.log("err",err)
                    } else {
                        dataToUpdate.profilePicURL.original = uploadedInfo && uploadedInfo.original &&  uploadedInfo.original || null;
                        dataToUpdate.profilePicURL.thumbnail = uploadedInfo && uploadedInfo.thumbnail && uploadedInfo.original || null;
                        console.log(dataToUpdate);
                        cb();
                    }
                })
              
            } else {
                cb();
            }
        },
        function (cb) {
            if (driverData && dataToUpdate && dataToUpdate.profilePicURL && dataToUpdate.profilePicURL.original) {
                //Update User
                var criteria = {
                    _id: driverData._id
                };
                var setQuery = {
                    $set: dataToUpdate
                };
                Service.HospitalService.updateDriver(criteria, setQuery, {new: true}, function (err, updatedData) {
                    driverData = updatedData;
                    cb(err, updatedData)
                })
            }else {
                if (driverData && driverData._id && profilePic && profilePic.originalname && !dataToUpdate.profilePicURL.original){
                    var criteria = {
                        _id: driverData._id
                    };
                    console.log("data>>>>>>>>>>");
                    cb();
                }else {
                    cb();
                }
            }
        }], function (err, data) {
        console.log('sending response',data)
       
       if (err) {
            callback(err);
        } else {
             responseToSend = {message:"Hospital added"};
            callback(null,responseToSend)
        }

    });
   
};


var getHospital =function(request,callback){
     var access_token= request.body.access_token;
    console.log(access_token);
    var isauth =false;
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
    },function (cb) {
        
         Service.HospitalService.getDriver({},{},{}, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                
                cb(null,data);
                
            }
        });

        } 


    
    ], function (err, data) {
        console.log('sending response',data)
       
       if (err) {
            callback(err);
        } else {
            callback(null,data)
        }

    });
   


}


module.exports={
    addHospital:addHospital,
    getHospital:getHospital
}