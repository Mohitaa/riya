var UniversalFunctions = require('../Utils/UniversalFunctions');
var responses = require('./responses');
var Controller = require('../Controller');
var commonFunc = require('./commonfunction');



exports.add_hospital  = function(request, reply) {
        console.log("---------------Add Hospital---------",request.headers);
       
        var access_token=request.body.access_token;
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
         Controller.HospitalController.addHospital(request, function (err, data) {
        if (err) {
            reply.send(UniversalFunctions.sendError(err))
            } else {
                console.log("________________________________________________",data);
           reply.send(UniversalFunctions.sendSuccess(null, data))
            }
    })}

    

};


exports.view_hospital  = function(request, reply) {
        console.log("---------------view Hospital---------",request.headers);
       
        var access_token=request.body.access_token;
        
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
         Controller.HospitalController.getHospital(request, function (err, data) {
        if (err) {
            reply.send(UniversalFunctions.sendError(err))
            } else {
                console.log("________________________________________________",data);
           reply.send(UniversalFunctions.sendSuccess(null, data))
            }
    })}

    

};