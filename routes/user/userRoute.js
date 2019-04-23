const express = require('express');
const router = express.Router();
const auth = require('../../modules/auth');

const userController = require('../../controllers/user/userController');


router.route('/users/userSignup')
    .post(userController.userSignup);

router.route('/users/userSignin')
    .post(userController.userSignin);

router.route('/users/create_profile')
    .post(auth.requiresLogin, userController.createProfile);
// .post(auth.requiresLogin, upload.any(), controller.createProfile);

router.route('/users/verifyOTP')
    .post(userController.varify_otp);

router.route('/users/resend_otp')
    .post(userController.resend_otp);

exports.Router = router;