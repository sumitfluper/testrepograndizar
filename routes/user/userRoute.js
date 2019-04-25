const express = require('express');
const router = express.Router();
const auth = require('../../modules/auth');

const userController = require('../../controllers/user/userController');


router.route('/userSignup')
    .post(userController.userSignup);

router.route('/userSignin')
    .post(userController.userSignin);

router.route('/create_profile')
    .post(auth.requiresLogin, userController.createProfile);
// .post(auth.requiresLogin, upload.any(), controller.createProfile);

router.route('/verifyOTP')
    .post(userController.varify_otp);

router.route('/resend_otp')
    .post(userController.resend_otp);

exports.Router = router;