
var UniversalFunctions = require('../Utils/UniversalFunctions');
var responses = require('./responses');
var Controller = require('../Controller');
var commonFunc = require('./commonfunction');





exports.admin_login = function(request, reply) {
         var email= request.body.email;
         var password=request.body.password;
         console.log(" ",password);

        var manvalues = [email, password];
        var checkblank = commonFunc.checkBlank(manvalues);
        if(checkblank==1)
        {
        responses.parameterMissingResponse(reply);
        return;
        }
        else
        {     
         var queryData = {
             email: email,
             password: password,
        };
        Controller.AdminController.adminLogin(queryData, function (err, data) {
        if (err) {
           reply.send(UniversalFunctions.sendError(err))
           } else {
         reply.send(UniversalFunctions.sendSuccess(null, data))
         }
    })
    }
    

};
exports.addConsultant  = function(request, reply) {
        console.log("---------------Add Consultant---------",request.headers);
       
        var access_token=request.headers.authorization;
        console.log(request.body.name+" "+ request.files+" payload")
       var manvalues = [access_token];
        var checkblank = commonFunc.checkBlank(manvalues);
        if(checkblank==1)
        {
            console.log("check");
        responses.parameterMissingResponse(reply);
        return;
        }
        else
        {     
         Controller.AdminController.addConsultant(request, function (err, data) {
        if (err) {
            reply.send(UniversalFunctions.sendError(err))
            } else {
                console.log("________________________________________________",data);
           reply.send(UniversalFunctions.sendSuccess(null, data))
            }
    })}

    

};



exports.getAllConsultant =function(request,reply){
    // console.log(request.query);
    var request=request.query;
    var access_token= request.access_token;
    var manvalues=[access_token];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
   }
    else{
    Controller.AdminController.getAllConsultant(request,function(err,data){
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
    Controller.AdminController.getAConsultant(request,function(err,data){
        if(err){

            reply.send(UniversalFunctions.sendError(err))
            
        } else {

            // console.log("________________________________________________",data);
            reply.send(data)
        }
    })
  }


}
exports.delete_user=function(request,reply){
    // console.log(request,"delete plan");
    var access_token= request.body.access_token;
    var manvalues=[access_token,request.body.user_id];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
   }
    else{
    Controller.AdminController.deleteUser(request,function(err,data){
        if(err){
            reply.send(UniversalFunctions.sendError(err))          
        } else {

            // console.log("________________________________________________",data);
            reply.send(data)
        }
    })
  }


}

exports.block_unblock_user=function(request,reply){
    // console.log(request,"delete plan");
    var access_token= request.body.access_token;
    var manvalues=[access_token,request.body.user_id];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
   }
    else{
    Controller.AdminController.block_unblock_user(request,function(err,data){
        if(err){
            reply.send(UniversalFunctions.sendError(err))          
        } else {

            // console.log("________________________________________________",data);
            reply.send(data)
        }
    })
  }


}
exports.delete_user=function(request,reply){
    // console.log(request,"delete plan");
    var access_token= request.body.access_token;
    var manvalues=[access_token,request.body.user_id];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
   }
    else{
    Controller.AdminController.deleteUser(request,function(err,data){
        if(err){
            reply.send(UniversalFunctions.sendError(err))          
        } else {

            // console.log("________________________________________________",data);
            reply.send(data)
        }
    })
  }


}

exports.getResetPasswordToken=function(request,reply){
    console.log(request.query,"token plan");
    var email= request.query.email;
    var manvalues=[email];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
   }
    else{
    Controller.AdminController.getResetPasswordToken(email,function(err,data){
        if(err){
            reply.send(UniversalFunctions.sendError(err))          
        } else {

            // console.log("________________________________________________",data);
            reply.send(UniversalFunctions.sendSuccess(null, data))
        }
    })
  }


}
exports.resetPassword=function(request,reply){
    console.log(request.body,"reset");
    var email= request.body.email;
    var token= request.body.passwordResetToken;
    var password= request.body.newPassword;
    var manvalues=[email,token,password];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
   }
    else{
    Controller.AdminController.resetPassword(request.body,function(err,data){
        if(err){
            reply.send(UniversalFunctions.sendError(err))          
        } else {

            // console.log("________________________________________________",data);
            reply.send(UniversalFunctions.sendSuccess(null, data))
        }
    })
  }


}

exports.removeAlignUser=function(request,reply){
    console.log(request.body,"reset");
    var username= request.body.username;
    var manvalues=[username];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
   }
    else{
    Controller.AdminController.removeAlignUser(request.body,function(err,data){
        if(err){
            reply.send(UniversalFunctions.sendError(err))          
        } else {

            // console.log("________________________________________________",data);
            reply.send(UniversalFunctions.sendSuccess(null, data))
        }
    })
  }


}

exports.logout=function(request,reply){
    console.log(request.headers,"logout");
    var access_token=request.headers.authorization;
    var manvalues=[access_token];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
   }
    else{
    Controller.AdminController.adminLogout(access_token,function(err,data){
        if(err){
            reply.send(UniversalFunctions.sendError(err))          
        } else {

            // console.log("________________________________________________",data);
            reply.send(UniversalFunctions.sendSuccess(null, data))
        }
    })
  }


}

