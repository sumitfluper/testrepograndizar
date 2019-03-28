var express = require('express');
var router = express.Router();
var multer = require('multer');
var auth = require('../modules/auth');
var md5 = require('md5')
var path = require('path')

var controller = require('../controllers/user.controller.js');

exports.getRouter = (app) => {
	const storage = multer.diskStorage({
		destination : function(req,file,callback){
			callback(null,'./Images/users');
		},
		filename : function(req,file,callback){
			let fileUniqueName = md5(Date.now());
			callback(null,fileUniqueName+ path.extname(file.originalname));
		}
	})
	
	let upload = multer({storage:storage});

	app.route('/users/userSignup').post(controller.userSignup);
	app.route('/users/userSignin').post(controller.userSignin);
	app.route('/users/create_profile').post(auth.requiresLogin, upload.any(),controller.createProfile);
	app.route('/users/verifyOTP').post(controller.varify_otp);
	app.route('/users/resend_otp').post(controller.resend_otp);
	return app;
}

// const storage = multer.diskStorage({
// 	destination : function(req,file,callback){
//         callback(null,'./Images');
// 	},
// 	filename : function(req,file,callback){
// 		let fileUniqueName = md5(Date.now());
//         callback(null,fileUniqueName+ path.extname(file.originalname));
//     }
// })

// let upload = multer({storage:storage});

// router.post('/users/userSignup',controller.userSignup);
// router.post('/users/userSignin',controller.userSignin);
// router.post('/users/create_profile',auth.requiresLogin, upload.any(),controller.createProfile);
// router.post('/users/verifyOTP',controller.varify_otp);
// router.post('/users/resend_otp',controller.resend_otp);



// module.exports = router;