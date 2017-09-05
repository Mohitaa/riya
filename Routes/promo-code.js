var UniversalFunctions = require('../Utils/UniversalFunctions');
var Controller = require('../Controller');
var commonFunc = require('./commonfunction');
var responses = require('./responses');




exports.getAllPromoCode=function(request,reply){
    var access_token =request.headers.authorization;
    var data =request.query;
    console.log("---------------promo request------",access_token,data);
    
    var manvalues=[access_token];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
     }
    else{
     Controller.PromoCodeController.getAllPromoCode(access_token, data,function(err,data){
        if(err){

            reply.send(UniversalFunctions.sendError(err))
            
        } else {

            // console.log("________________________________________________",data);
            reply.send(UniversalFunctions.sendSuccess(null, data))
        }
    })

  }
}
exports.addPromo=function(request,reply){
    var access_token =request.headers.authorization;
    var data =request.body;
    console.log("---------------promo requests add------",access_token,data);
    
    var manvalues=[access_token];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
     }
    else{
     Controller.PromoCodeController.createPromoCode(access_token, data,function(err,data){
        if(err){

            reply.send(UniversalFunctions.sendError(err))
            
        } else {

            // console.log("________________________________________________",data);
            reply.send(UniversalFunctions.sendSuccess(null, data))
        }
    })

  }
}
 
exports.deletePromoCode=function(request,reply){
    console.log("--------------delete promo code Api----------");
    var access_token =request.headers.authorization;
    var data =request.query;
    console.log("---------------promo requests delete------",access_token,data);
    
    var manvalues=[access_token];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
     }
    else{
     Controller.PromoCodeController.deletePromoCode(access_token, data,function(err,data){
        if(err){

            reply.send(UniversalFunctions.sendError(err))
            
        } else {

            // console.log("________________________________________________",data);
            reply.send(UniversalFunctions.sendSuccess(null, data))
        }
    })

  }
    
}
exports.edit_promo=function(request,reply){
    console.log("--------------edit promo code Api----------");
    var access_token =request.headers.authorization;
    var data =request.body;
    console.log("---------------promo requests edit------",access_token,data);
    
    var manvalues=[access_token];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
     }
    else{
     Controller.PromoCodeController.editPromoCode(access_token, data,function(err,data){
        if(err){

            reply.send(UniversalFunctions.sendError(err))
            
        } else {

            // console.log("________________________________________________",data);
            reply.send(UniversalFunctions.sendSuccess(null, data))
        }
    })

  }
    
}
var noedit=function(request,reply){

    console.log("----request----");
    var data =request.body;
    console.log(data);
    access_token=data.access_token;
    var manvalues= [access_token];
    var checkblank =commonFunc.checkBlank(manvalues);
    if(checkblank==1){
        res.send("paramenter is missing")
    }else{
        
    }
}

