
var UniversalFunctions = require('../Utils/UniversalFunctions');
var responses = require('./responses');
var Controller = require('../Controller');
var commonFunc = require('./commonfunction');





exports.getAllUser =function(request,reply){
    // console.log(request.query);
    var request=request.query;
    var access_token= request.access_token;
    var manvalues=[access_token];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
   }
    else{
    Controller.UserController.getAllUser(request,function(err,data){
        if(err){

            reply.send(UniversalFunctions.sendError(err))
            
        } else {

            // console.log("________________________________________________",data);
            reply.send(data)
        }
    })
  }
}

exports.user_details =function(request,reply){
     // console.log(request.query);
    
    var access_token= request.body.access_token;
    var manvalues=[access_token];
    console.log(request.body.access_token);
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
   }
    else{
    Controller.UserController.getAUser(request,function(err,data){
        if(err){

            reply.send(UniversalFunctions.sendError(err))
            
        } else {

            // console.log("________________________________________________",data);
            reply.send(data)
        }
    })
  }

}



exports.get_all_consultantname =function(request,reply){
    // console.log(request.query);
    var request=request.body;
    var access_token= request.access_token;
    var manvalues=[access_token];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
   }
    else{
    Controller.UserController.getAllConsultant(request,function(err,data){
        if(err){

            reply.send(UniversalFunctions.sendError(err))
            
        } else {

            // console.log("________________________________________________",data);
            reply.send(data)
        }
    })
  }


}


exports.editUser =function(request,reply){
     console.log(request.body);
    var request=request.body;
    var access_token= request.access_token;
    var manvalues=[access_token];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
   }
    else{
    Controller.UserController.UpdateUser(request,function(err,data){
        if(err){

            reply.send(UniversalFunctions.sendError(err))
            
        } else {

            // console.log("________________________________________________",data);
            reply.send(data)
        }
    })
  }


}