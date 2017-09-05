var APP_CONSTANTS = require('../Config/appConstants');
var Config = require('../Config');
var async = require('async');
var apns = require('apn');
var Path = require('path');
var nodeMailerModule = require('nodemailer');
var winston = require("winston");

var sendEmailToUser = function (emailType ,emailVariables, emailId, callback) {
    console.log(emailType,emailVariables,"var")
    var mailOptions = {
        from: 'rajput.mamta925@gmail.com',
        to: 'mamtarajput925@gmail.com',
        subject: null,
        html: null
    };


    async.series([
        function(cb){
            switch (emailType){
                case 'REGISTRATION_MAIL' :
                    mailOptions.subject =APP_CONSTANTS.notificationMessages.registrationEmail.emailSubject;
                    mailOptions.html = renderMessageFromTemplateAndVariables(APP_CONSTANTS.notificationMessages.registrationEmail.emailMessage, emailVariables) ;
                    break;
                case 'FORGOT_PASSWORD' :
                    mailOptions.subject = APP_CONSTANTS.notificationMessages.forgotPassword.emailSubject;
                    mailOptions.html = renderMessageFromTemplateAndVariables(APP_CONSTANTS.notificationMessages.forgotPassword.emailMessage, emailVariables) ;
                    break;
                case 'DRIVER_CONTACT_FORM' :
                    mailOptions.subject = APP_CONSTANTS.notificationMessages.contactDriverForm.emailSubject;
                    mailOptions.html = renderMessageFromTemplateAndVariables(APP_CONSTANTS.notificationMessages.contactDriverForm.emailMessage, emailVariables) ;
                    break;
                case 'BUSINESS_CONTACT_FORM' :
                    mailOptions.subject = APP_CONSTANTS.notificationMessages.contactBusinessForm.emailSubject;
                    mailOptions.html = renderMessageFromTemplateAndVariables(APP_CONSTANTS.notificationMessages.contactBusinessForm.emailMessage, emailVariables) ;
                    break;
            }
            cb();

        },function(cb){
            sendMailViaTransporter(mailOptions, function(err,res){
                cb(err,res);
            })
        }
    ], function (err, responses) {
        if (err){
            callback(err);
        }else {
            callback();
        }
    });

};
function sendMailViaTransporter(mailOptions, cb) {
    // transporter.sendMail(mailOptions, function (error, info) {
    //     winston.info('Mail Sent Callback Error:',error);
    //     winston.info('Mail Sent Callback Ifo:',info);
    // });
    // cb(null, null) // Callback is outside as mail sending confirmation can get delayed by a lot of time

   var transporter = nodeMailerModule.createTransport({
    service: 'gmail',
    auth: {
        user: 'rajput.mamta925@gmail.com',
        pass: 'Mamta@123'
    }
}); 

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
    cb(null, null) 
    }

//------------------









function renderMessageFromTemplateAndVariables(templateData, variablesData) {
    var Handlebars = require('handlebars');
    return Handlebars.compile(templateData)(variablesData);
}


module.exports={
        sendEmailToUser:sendEmailToUser

}