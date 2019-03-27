var express = require('express');
var router = express.Router();
var auth = require ('../modules/auth');
var multer = require ('multer');
var md5 = require ('md5');
var path = require ('path');
var admin_controller = require('../controllers/admin_controller')

exports.getRouter = (app) => {

	const storage = multer.diskStorage({
		destination : function(req,file,callback){
        callback(null,'./src/uploads/user');
		},
		filename : function(req,file,callback){
			let fileUniqueName = md5(Date.now());
        	callback(null,fileUniqueName+ path.extname(file.originalname));
    	}
	})
    let upload = multer({storage:storage});
    
	app.route('/admin/login').post(admin_controller.admin_signin);
	app.route('/admin/forget_password').post(admin_controller.forget_password)
	app.route('/admin/verifyOTP').post(admin_controller.verifyOTP)
	app.route('/admin/reset_password').post(admin_controller.reset_password)
	app.route('/admin/resendOTP').post(admin_controller.resend_otp)
	
	
	return app;
}