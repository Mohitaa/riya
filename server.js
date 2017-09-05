var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var jwt = require('jsonwebtoken');
var winston = require("winston");
var path = require('path');
var Bootstrap = require('./Utils/Bootstrap');
var admin_panel = require('./Routes/admin-panel');
var user = require('./Routes/user');
var hospital = require('./Routes/hospital');
var promoCode=require('./Routes/promo-code');
var multer=require('multer');
var plan = require('./Routes/plan');
app.use(methodOverride());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(multer({dest:'./uploads/'}).any());
app.get('/',function(req,res){
   res.sendFile('index.html',{ root: __dirname });

});

var Router = express.Router();


//@@@@@@@@@@@@@@ CORS @@@@@@@@@@@@@@@@
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log("Api Hit");

    var time = new Date();
    time.setMilliseconds(time.getMilliseconds() + 5.5 * 60 * 60 * 1000);
    console.log('Time:', time.toString());
    console.log(req.body,"  ",req.files);
    console.log("request end");

    next();
});

// app.post('/signup',user.signup);

app.post('/api/admin/login', admin_panel.admin_login);
app.get('/api/admin/getResetPasswordToken',admin_panel.getResetPasswordToken)
app.put('/api/admin/resetPassword',admin_panel.resetPassword);
app.post('/remove_align_user', admin_panel.removeAlignUser);
app.put('/api/admin/logout',admin_panel.logout);
app.post('/api/admin/add_plan', plan.addPlan);
app.get('/get_all_plan_data', plan.getAllpPlanData); 
app.post('/delete_plan', plan.deletePlan);
app.post('/api/admin/edit_plan',plan.editPlan)
app.use('/api/admin/add_consultant', multipartMiddleware);
app.post('/api/admin/add_consultant', admin_panel.addConsultant);
app.get('/get_all_consultant_data', admin_panel.getAllConsultant);
app.post('/user_details', admin_panel.user_details);
app.post('/delete_user', admin_panel.delete_user );
app.post('/block_unblock_user', admin_panel.block_unblock_user );
app.post('/add_hospital',hospital.add_hospital);
app.post('/view_hospital',hospital.view_hospital);
app.get('/api/admin/getAllPromoCode',promoCode.getAllPromoCode)
app.post('/api/admin/promo',promoCode.addPromo)
app.delete('/api/admin/deletePromoCode',promoCode.deletePromoCode);
app.post('/api/admin/edit_promo',promoCode.edit_promo);

//user data  ---------------
app.get('/get_all_user_data', user.getAllUser);
app.post('/user_detail', user.user_details);
app.post('/get_all_consultantname', user.get_all_consultantname);
app.post('/edit_user_profile', user.editUser);



Bootstrap.bootstrapAdmin(function (err, message) {
    if (err) {
        winston.error('Error while bootstrapping admin : ' + err)
    } else {
        winston.info(message);
    }
});


var port = process.env.PORT || 3001;
var server=app.listen(port,function(req,res){
    console.log("Catch the action at http://localhost:"+port);
});
