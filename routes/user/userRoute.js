const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../../modules/auth');
const md5 = require('md5')
const path = require('path')

const userController = require('../../controllers/user/userController');


app.route('/users/userSignup')
    .post(controller.userSignup);

app.route('/users/userSignin')
    .post(controller.userSignin);

app.route('/users/create_profile')
    .post(auth.requiresLogin, controller.createProfile);
    // .post(auth.requiresLogin, upload.any(), controller.createProfile);

app.route('/users/verifyOTP')
    .post(controller.varify_otp);

app.route('/users/resend_otp')
    .post(controller.resend_otp);

exports.Router = router;