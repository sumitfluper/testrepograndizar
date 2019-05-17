const express = require('express');
const router = express.Router();
const auth = require('../../modules/auth');
const multer = require('multer');
const userController = require('../../controllers/user/userController');
const md5=require('md5');
const path=require('path');


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

router.route('/userSignup')
    .post(userController.userSignup);

router.route('/userSignin')
    .post(userController.userSignin);

router.route('/create_profile')
    .post(auth.requiresLogin,upload.any(), userController.createProfile);

router.route('/verifyOTP')
    .post(userController.varify_otp);

router.route('/resend_otp')
	.post(userController.resend_otp);

// for user manage notification 
router.route('/managenotification')
	.post(auth.requiresLogin, userController.manageNotification);

// upload documents
router.route('/updateprofile')
	.post(auth.requiresLogin,upload.any(), userController.updateUserDocuments);
	// .post(auth.requiresLogin,upload.any(), userController.updateUserDocuments);

exports.Router = router;