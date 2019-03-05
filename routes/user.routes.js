var express = require('express');
var router = express.Router();
var multer = require('multer');
var auth = require('../modules/auth');
var md5 = require('md5')
var path = require('path')

var controller = require('../controllers/user.controller.js');



const storage = multer.diskStorage({
	destination : function(req,file,callback){
        callback(null,'./Images');
	},
	filename : function(req,file,callback){
		let fileUniqueName = md5(Date.now());
        callback(null,fileUniqueName+ path.extname(file.originalname));
    }
})

let upload = multer({storage:storage});

router.post('/users/userSignup',controller.userSignup);
router.post('/users/userSignin',controller.userSignin);
router.post('/users/create_profile',auth.requiresLogin, upload.any(),controller.createProfile);
router.post('/users/verifyOTP',controller.varify_otp);
router.post('/users/resend_otp',controller.resend_otp);



module.exports = router;