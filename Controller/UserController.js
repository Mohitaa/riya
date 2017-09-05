
var UniversalFunctions = require('../Utils/UniversalFunctions');
var TokenManager = require('../Lib/TokenManager');
var async = require('async');
var Service = require('../Services');
var commonFunc = require('../Routes/commonfunction');
var APP_CONSTANTS = require('../Config/appConstants');
var winston = require('winston');
var NotificationManager = require('../Lib/NotificationManager');


var addUser = function(request,callback){
        console.log("Add User")
    var access_token= request.headers.authorization;
    var data =request.body;
     var dataToSet = {};
     var workExperience={};
    
    if (data.firstName) {
        dataToSet.name = data.firstName+" "+data.lastName;
    }
    if (data.email) {
        dataToSet.email = data.email;
    }
    if (data.phoneNo) {
        dataToSet.phoneNo = data.phoneNo;
    }
    if (data.password) {
        dataToSet.password = data.password;
    }
    if (data.countryCode) {
        dataToSet.countryCode = data.countryCode;
    }
     if (data.UserType) {
        dataToSet.UserType = data.UserType;
    }
    if (data.details) {
        dataToSet.details = data.details;
    }
    if (data.address) {
        dataToSet.address = data.address;
    }
    if (data.city) {
        dataToSet.city = data.city;
    }
    if (data.state) {
        dataToSet.state = data.state;
    }
    if (data.pinCode) {
        dataToSet.pinCode = data.pinCode;
    }
    if (data.profilePic && data.profilePic.filename) {
        dataToUpdate.profilePicURL = {
            original: null,
            thumbnail: null
        }
    }
    if (data.company) {
        workExperience.companyName = data.company;
    } if (data.company1) {
        workExperience.companyName1 = data.company1;
    } if (data.company2) {
        workExperience.companyName2 = data.company2;
    }if (data.duration) {
        workExperience.duration = data.duration;
    }if (data.duration1) {
        workExperience.duration1 = data.duration1;
    }if (data.duration2) {
        workExperience.duration2 = data.duration2;
    }if (data.todate) {
        workExperience.toDate = data.todate;
    }if (data.todate1) {
        workExperience.toDate1 = data.todate1;
    }if (data.todate2) {
        workExperience.toDate2 = data.todate2;
    }if (data.fromdate) {
        workExperience.fromDate = data.fromdate;
    }if (data.fromdate1) {
        workExperience.fromDate1 = data.fromdate1;
    }if (data.fromdate2) {
        workExperience.fromDate2 = data.fromdate2;
    }if (data.position) {
        workExperience.position = data.position;
    }if (data.position1) {
        workExperience.position1 = data.position1;
    }if (data.position2) {
         workExperience.position2 = data.position2;
    }
    dataToSet.userType =data.userType ||1;
    dataToSet.workExperience =workExperience;
    
    console.log(dataToSet)

    var isauth =false;
     async.series([
        function (cb) {
        var getCriteria = {
            accessToken: access_token
        };
        console.log("criteria",getCriteria)
        Service.UserService.getUser(getCriteria, {}, {}, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                if (data && data.length > 0 ) {
                    console.log("authenticated")
                    isauth=true;
                    cb()
                } else {
                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_USER_PASS)
                }
            }
        });
        }, function (cb) {
        if (isauth) {
         Service.UserService.createUser(dataToSet,function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                if(data!=null)
                {
                    console.log("saved");
                 }
                cb(null,data);
                
            }
        });

        } 

    } ], function (err, data) {
        console.log('sending response',data)
       
       if (err) {
            callback(err);
        } else {
           
                 var response = {
                "message": "User Added  Successfully",
                "status": 200,
                "data": data
                    };
            callback(null,response)
        }

    });
   

}

var getdata = function(UserData, callback) {
          Service.UserService.getUser({"name":UserData.created_by}, {}, {}, function (err, data) {
            if (err) {
                callback({errorMessage: 'DB Error: ' + err})
            } else {
                if (data && data.length > 0 && data[0].email) {
                    console.log(data)
                    callback(null,data)
                } else {
                    cb("APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_USER_PASS")
                }
            }
        });
    



};

var getAllUser=function(request,callback){

    var access_token= request.access_token;
    var iDisplayLength=parseInt(request.iDisplayLength);
    var iDisplayStart=parseInt(request.iDisplayStart);
    var sSearch=request.sSearch;
    console.log(iDisplayLength)
    var arrResultRides = new Array();
    var totalCount=0;
    var resultSet=[];
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
    }, function (cb) {
        if (isauth) {
        var getCriteria = {
            userType: 2
        };
         Service.UserService.countUsers(getCriteria, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                if(data!=null)
                {
                    console.log(data,"count")
                    totalCount=data;
                }
                cb();
                
            }
        });

        } 

    },function (cb) {
        if (isauth) {
        if(sSearch!=null && sSearch && sSearch!=''){
          var getCriteria =   {
            "$or": [
                { "name": { "$regex": sSearch} }, 
                { "email": { "$regex": sSearch } },
                { "UserType": { "$regex": sSearch } }
             ]
          }
          }    
           else {
           var getCriteria = {
               userType:2
           }
          }
            var options = {
                    limit: iDisplayLength || 0,
                    skip: iDisplayStart || 0,
                    //sort: {startDate: -1}
                };
         Service.UserService.getUser(getCriteria,{},options, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                console.log(data)
                
                if(data!=null && data && data.length>0)
                {
                    console.log(data);
                    
                    var k=iDisplayStart+1;
                    for (var i = 0; i < data.length; i++) {
                        var j = 0;
                        arrResultRides[i] = new Array();
                        arrResultRides[i][j++] = k++;
                        arrResultRides[i][j++] = data[i].userId;
                        arrResultRides[i][j++] = data[i].name;
                        arrResultRides[i][j++] = data[i].email;
                        arrResultRides[i][j++] = data[i].phoneNo;
                        arrResultRides[i][j++] = data[i].totalRating||0;
                        arrResultRides[i][j++] = 11;
                           console.log(data[i].isBlocked);
                         if(data[i].isBlocked) {
                          
                          blockButton = '<a type="button" class="btn btn-default unblock" id=' + data[i]._id + '><i class="fa fa-lock block-icon"></i></a>'
                          } else{
                         blockButton = '<a type="button" class="btn btn-default block" id=' + data[i]._id  + '><i class="fa fa-unlock unblock-icon"></i></a>'
                        }

                       arrResultRides[i][j++] = '<a type="button" class="btn btn-default ViewDetails" id=' + data[i]._id  + '><i class="fa fa-eye pencil-icon"></i></a>';
                       arrResultRides[i][j++] = '<a type="button" class="btn btn-default edit" id=' + data[i]._id  + '><i class="fa fa-pencil icon-css pencil-icon"></i></a>' +
                      blockButton +
                    '<a type="button" class="btn btn-default delete" id=' + data[i]._id  + '><i class="fa fa-trash-o block-icon"></i></a>' ;
                     arrResultRides[i][j++] = data[i]._id;
                }
                                      
                }
                cb();
                
            }
        });

        } 

    }
    
    ], function (err, data) {
        console.log('sending response',data)
       
       if (err) {
            callback(err);
        } else {
                 var response = {
                "iTotalDisplayRecords": totalCount,
                "iTotalRecords": totalCount,
                "sEcho": request.sEcho,
                "aaData": arrResultRides
            };
            callback(null,response)
        }

    });
   

}

//----------------------------get a User  by userid-----------------------
var getAUser=function(request,callback){

    var access_token= request.body.access_token;
    var userid =request.body.user_id;
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
    }, function (cb) {
        if (isauth) {
        var getCriteria = {
            _id:userid
        };
             
        var projection={
            
        }
         var populateVariable = {path: 'consultantId',select:"name email phoneNo AdminNumericId"}
         Service.UserService.getAndPopulateUser(getCriteria, projection, {} ,populateVariable, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
          
                cb(null,data);
                
            }
        });

        } 

    }
    
    ], function (err, data) {
        console.log('sending response',data)
       
       if (err) {
            callback(err);
        } else {
                var response = {
                     "message":"ACTION_COMPLETE",
                     "status": 200,
                     "data": data
                    };
            callback(null,response)
        }

    });
   

}

var deleteUser=function(request,callback){

    var access_token= request.body.access_token;
    var userid =request.body.user_id;
    var isauth =false;
     async.series([
        function (cb) {
        var getCriteria = {
            accessToken: access_token
        };

            Service.UserService.getUser(getCriteria, {}, { }, function (err, data) {
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
        if (isauth) {
        var getCriteria = {
            _id:userid,
            userType:1
        };

         Service.UserService.deleteUserbyId(getCriteria, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
          
                cb(null,data);
                
            }
        });

        } 

    }
    
    ], function (err, data) {
        console.log('sending response',data)
       
       if (err) {
            callback(err);
        } else {
                var response = {
                     "message":"ACTION_COMPLETE",
                     "status": 200,
                     "data": data
                    };
            callback(null,response)
        }

    });
   

}
var block_unblock_user=function(request,callback){

    var access_token= request.body.access_token;
    var userid =request.body.user_id;
    var block_status =parseInt(request.body.block_status)
    // if(request.body.block_status==1){
    //     block_status = 0;
    // }else{
    //      block_status=1;
    // }
    var isauth =false;
     async.series([
        function (cb) {
        var getCriteria = {
            accessToken: access_token
        };

            Service.UserService.getUser(getCriteria, {}, {}, function (err, data) {
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
        if (isauth) {
        var getCriteria = {
            _id:userid,
            userType:1
        };
        var setQuery = {
            $set: {isBlocked: block_status}
        };

         Service.UserService.updateUser(getCriteria,setQuery,{}, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                 console.log(data,"dataa  ");
                if (data) {

                    console.log(data,"data");
                   cb(null,data);
                }else{
                    cb();
                }
                
            }
        });

        } 

    }
    
    ], function (err, data) {
        console.log('sending response...........',data[1])
       
       if (err) {
            callback(err);
        } else {
                var response = {
                     "message":"ACTION_COMPLETE",
                     "status": 200,
                     "data": data[1]
                    };
            callback(null,response)
        }

    });
   

}


var getResetPasswordToken = function (email, callback) {
    email = email.toLowerCase();
    var generatedString = UniversalFunctions.generateRandomString();
    generatedString =  UniversalFunctions.CryptData(generatedString)
    var customerObj = null;
    if (!email) {
        callback(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
    } else {
        async.series([
            function (cb) {
                //update user
                var criteria = {
                    email: email
                };

                var setQuery = {
                    passwordResetToken: generatedString
                };
                Service.UserService.updateUser(criteria, setQuery, {new: true}, function (err, userData) {
                    winston.info('update user', err, userData, !userData)
                    if (err) {
                        cb(err)
                    } else {
                        if (!userData || userData.length == 0) {
                            cb(APP_CONSTANTS.STATUS_MSG.ERROR.NOT_FOUND);
                        } else {
                            customerObj = userData;
                            cb()
                        }
                    }
                })
            },
            function (cb) {
                if (customerObj) {
                    var variableDetails = {
                        user_name: customerObj.name,
                        password_reset_token: generatedString,
                        password_reset_link: "http://localhost:3001/#/page/resetPassword/" + generatedString + '/' + customerObj.email + '/User'
                    };
                    NotificationManager.sendEmailToUser('FORGOT_PASSWORD', variableDetails, customerObj.email, cb)
                } else {
                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
                }
            }
        ], function (err, result) {
            if (err) {
                callback(err)
            } else {
                callback(null, {password_reset_token: customerObj.passwordResetToken})//TODO Change in production DO NOT Expose the password
            }
        })
    }
};


var resetPassword = function (payloadData, callback) {
    var customerObj = null;
    if (!payloadData || !payloadData.email || !payloadData.passwordResetToken || !payloadData.newPassword) {
        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
    } else {
        async.series([
            function (cb) {
                //Get User
                var criteria = {
                    email: payloadData.email
                };
                Service.UserService.getUser(criteria, {}, {lean: true}, function (err, userData) {
                    if (err) {
                        cb(err)
                    } else {
                        if (!userData || userData.length == 0) {
                            cb(APP_CONSTANTS.STATUS_MSG.ERROR.NOT_FOUND);
                        } else {
                            customerObj = userData && userData[0] || null;
                            cb()
                        }
                    }
                })
            },
            function (cb) {
                if (customerObj) {
                    if (customerObj.passwordResetToken != payloadData.passwordResetToken) {
                        cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_RESET_PASSWORD_TOKEN);
                    } else {
                        cb();
                    }
                } else {
                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.NOT_FOUND);
                }
            },
            function (cb) {
                if (customerObj) {
                    var criteria = {
                        email: payloadData.email
                    };
                    var setQuery = {
                        password: UniversalFunctions.CryptData(payloadData.newPassword),
                        $unset: {passwordResetToken: 1}
                    };
                    Service.UserService.updateUser(criteria, setQuery, {}, function (err, userData) {
                        if (err) {
                            cb(err)
                        } else {
                            cb();
                        }
                    })
                } else {
                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
                }
            }
        ], function (err, result) {
            callback(err, null);
        })
    }
};

var UserLogout = function (access_token, callback) {
    if (!access_token) {
        callback(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
    } else {
        
        async.series([
            function (cb) {
                //TODO Check Active User Of Customer
                cb();
            },
            function (cb) {
                var criteria = {
                    accessToken: access_token
                };
                var setQuery = {
                    $unset: {
                        accessToken: 1,deviceToken:1
                    }
                };
                var options = {};
                Service.UserService.updateUser(criteria, setQuery, options, cb);
            }
        ], function (err, result) {
            callback(err, null);
        })
    }
};



var getAllConsultant=function(request,callback){

    var access_token= request.access_token;
    var arrResultRides = new Array();
    var totalCount=0;
    var resultSet=[];
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
        if (isauth) {
  
          
           var getCriteria = {
               userType:1
           }
          
         Service.AdminService.getAdmin(getCriteria,{name:1},{}, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                
                if(data!=null && data && data.length>0)
                {
                    console.log(data);
                    
                  
                    for (var i = 0; i < data.length; i++) {
                        
                        arrResultRides[i] = new Array();
                       
                        arrResultRides[i] = data[i].name;
                    }
                                      
                }
                cb();
                
            }
        });

        } 

    }
    
    ], function (err, data) {
        console.log('sending response',data)
       
       if (err) {
            callback(err);
        } else {
                 var response = {
                "aaData": arrResultRides
            };
            callback(null,response)
        }

    });
   

}


// update customer info all
var UpdateUser = function ( data, callback) {
    console.log("userdata",data)
    var criteria = {
        _id: data.user_id
    };
    var consultantId;
    var dataToSet = {};
   var dataToSet = {};
    if (data.user_name) {
        dataToSet.firstName = data.user_name;
    }
    if (data.lastName) {
        dataToSet.lastName = data.lastName;
    }
    if (data.user_email) {
        dataToSet.email = data.user_email;
    }
    if (data.phn_no) {
        dataToSet.phoneNo = data.phn_no;
    }
    if (data.listConsutant) {
        dataToSet.listConsutant = data.listConsutant;
    }
    if (data.deviceToken) {
        dataToSet.deviceToken = data.deviceToken;
    }
    if (data.appVersion) {
        dataToSet.appVersion = data.appVersion;
    }
    if (data.deviceType) {
        dataToSet.deviceType = data.deviceType;
    }
    if (data.hasOwnProperty('isBlocked')) {
        dataToSet.isBlocked = data.isBlocked;
    }
    if (data.hasOwnProperty('defaultCheckoutOption')) {
        dataToSet.defaultCheckoutOption = data.defaultCheckoutOption;
    }
    var options = {
        new: true
    };

     async.series([
        function (cb) {
        var getCriteria = {
            accessToken: data.access_token
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
        if (isauth) {
  
          if(dataToSet.listConsutant){
           var getCriteria = {
               userType:1,
               name:dataToSet.listConsutant
               
           }
           var projection={
               _id:1
           }
          
         Service.AdminService.getAdmin(getCriteria,projection,{}, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                
                if(data!=null && data && data.length>0)
                {
                    console.log(data,"data aa");
                    consultantId=data[0]._id
                    console.log(consultantId,"dta consultent");
                    dataToSet.consultantId=consultantId;
                      console.log(dataToSet,"dta set data");                             
                }
                cb();
                
            }
        });

        } 
    }
}, function (cb) {
        if (isauth && consultantId) {
        var getCriteria = {
            _id:consultantId,
            userType:1
        };
        var setQuery = {
            $push: {userId:data.user_id}
        };

         Service.AdminService.updateArray(getCriteria,setQuery,{}, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                 console.log(data,"dataa in admin ");
                if (data) {

                    console.log(data,"data");
                   cb(null,data);
                }else{
                    cb();
                }
                
            }
        });

        } 

    },

    function (cb) {
        if (isauth) {
  
          
           var getCriteria = {
               userType:2,
               userId:data.user_id
               
           
           }
          
         Service.UserService.updateUser(getCriteria,dataToSet,{}, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                
                if(data!=null && data && data.length>0)
                {
                    console.log(data, "data");  
                    cb(null,data);                                   
                }
                else
                cb();
                
            }
        });

        } 

    }
    
    ], function (err, data) {
        console.log('sending response',data)
       
       if (err) {
            callback(err);
        } else {
            callback(null,data)
        }

    });
};

module.exports={
    
    getdata:getdata,
    addUser:addUser,
    getAllUser:getAllUser,
    getAUser:getAUser,
    deleteUser:deleteUser,
    block_unblock_user:block_unblock_user,
    getAllConsultant:getAllConsultant,
    UpdateUser:UpdateUser

}