
var UniversalFunctions = require('../Utils/UniversalFunctions');
var async = require('async');
var Service = require('../Services');
var commonFunc = require('../Routes/commonfunction');
var APP_CONSTANTS = require('../Config/appConstants');
var winston = require('winston');
var constants = require('./constants');



// add plan for different
var addPlan = function(request, callback) {
        var planName=request.body.name.toUpperCase();
        var price= request.body.price;
        var duration= request.body.duration;
        var  category= request.body.category;
        var services= request.body.services ;
        var saveData={
            planName:planName,
            price:price,
            duration:duration,
            category:category,
            services:services

        }
    var access_token=request.headers.authorization;
    console.log(access_token);
    var isauth =false;
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
                    console.log("data",data)
                    isauth=true;
                    cb()
                } else {
                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_USER_PASS)
                }
            }
        });
    }, function (cb) {
        if (isauth) {
         Service.PlanService.addPlan(saveData, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
               
                cb(null,"Plan Added Successfully");
                
            }
        });

        } 

    }], function (err, data) {
        winston.info('sending response',data)
       
       if (err) {
            callback(err);
        } else {
             responseToSend = {message:"plan added"};
            callback(null,responseToSend)
        }

    });
   
};

/*--------------------- get plan-------------------*/

var getPlan=function(request,callback){

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
         Service.PlanService.countPlans({}, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                if(data!=null)
                {
                    
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
                { "planName": { "$regex": sSearch} }, 
                { "category": { "$regex": sSearch } },
                { "services": { "$regex": sSearch } }
             ]
          }
          }    
           else {
           var getCriteria = {}
          }
            var options = {
                    limit: iDisplayLength || 0,
                    skip: iDisplayStart || 0,
                    //sort: {startDate: -1}
                };
         Service.PlanService.getPlan(getCriteria,{},options, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                
                if(data!=null && data && data.length>0)
                {

                    
                    var k=iDisplayStart+1;
                    for (var i = 0; i < data.length; i++) {
                        var j = 0;
                        arrResultRides[i] = new Array();
                        arrResultRides[i][j++] = k++;
                        arrResultRides[i][j++] = data[i].planName;
                        arrResultRides[i][j++] = data[i].category;
                        arrResultRides[i][j++] = data[i].services;
                        arrResultRides[i][j++] = data[i].price;
                        arrResultRides[i][j++] = data[i].duration;
                     arrResultRides[i][j++] = '<a type="button" class="btn btn-default edit" id=' + data[i]._id  + '><i class="fa fa-pencil icon-css pencil-icon"></i></a>' +
                    
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

//----------------------------------delete plan------------------------------

var deletePlan=function(request,callback){
console.log("in delete plan")
    var access_token= request.body.access_token;
    var plan_id = request.body.plan_id;
       console.log("gesrsaf",access_token,plan_id);
    var isauth =false;
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
                    console.log("data",data)
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
              _id: plan_id
        };
         Service.PlanService.deletePlanbyId(getCriteria,function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                if(data!=null)
                {
                    console.log("count",data);
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
                "message": "Plan Deleted Successfully",
                "status": 200,
                "data": data
                    };
            callback(null,response)
        }

    });
   

}

var editPlan = function(access_token,data,callback){

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
                      _id :data.id
                };     
                var dataToSet ={
                    "planName" :data.name,
                    "category" : data.category,
                    "duration" : data.duration,
                    "price" : data.price,
                    "services" : data.services,
                                   
                }  
                var  options = {
                    new: true
                }  
         Service.PlanService.updatePlans(criteria,dataToSet,options, function (err, result) {
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
    addPlan:addPlan,
    getPlan:getPlan,
    deletePlan:deletePlan,
    editPlan:editPlan
}