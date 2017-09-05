
var UniversalFunctions = require('../Utils/UniversalFunctions');
var Controller = require('../Controller');
var commonFunc = require('./commonfunction');
var responses = require('./responses');




exports.addPlan = function(request, reply) {
       console.log("---------------Add Plan---------",request.headers.username);
       console.log(request.body);
        var access_token=request.headers.authorization;
        var  name=request.body.name;
        var price= request.body.price;
        var duration= request.body.duration;
        var  category= request.body.category;
        var services= request.body.services ;
        console.log(name,price,duration,category,services,access_token)
       var manvalues = [name,price,duration,category,services];
        var checkblank = commonFunc.checkBlank(manvalues);
        if(checkblank==1)
        {
            console.log("check");
        responses.parameterMissingResponse(reply);
        return;
        }
        else
        {     
         Controller.PlanController.addPlan(request, function (err, data) {
        if (err) {
            reply.send(UniversalFunctions.sendError(err))
            } else {
                console.log("________________________________________________",data);
           reply.send(UniversalFunctions.sendSuccess(null, data))
            }
    })}
    

};
exports.getAllpPlanData=function(request,reply){
    // console.log(request.query);
    var request=request.query;
    var access_token= request.access_token;
    var manvalues=[access_token];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
   }
    else{
    Controller.PlanController.getPlan(request,function(err,data){
        if(err){

            reply.send(UniversalFunctions.sendError(err))
            
        } else {

            // console.log("________________________________________________",data);
            reply.send(data)
        }
    })
  }


}

exports.deletePlan=function(request,reply){
    // console.log(request,"delete plan");
    var access_token= request.body.access_token;
    var manvalues=[access_token,request.body.plan_id];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
   }
    else{
    Controller.PlanController.deletePlan(request,function(err,data){
        if(err){

            reply.send(UniversalFunctions.sendError(err))
            
        } else {

            // console.log("________________________________________________",data);
            reply.send(data)
        }
    })
  }


}

exports.editPlan=function(request,reply){
    console.log(request.body,"edit plan");
    var access_token= request.headers.authorization;
    var manvalues=[access_token,request.body.id];
    var checkblank = commonFunc.checkBlank(manvalues);
    if(checkblank==1){
    responses.parameterMissingResponse(reply);
   }
    else{
    Controller.PlanController.editPlan(access_token,request.body,function(err,data){
        if(err){

            reply.send(UniversalFunctions.sendError(err))
            
        } else {

            // console.log("________________________________________________",data);
            reply.send(data)
        }
    })
  }


}
