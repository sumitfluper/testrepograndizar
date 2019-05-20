const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController');
router.route('/login')
    .post(adminController.adminSignIn);

router.route('/forget_password')
    .post(adminController.forgetPassword);

router.route('verifyOTP')
    .post(adminController.verifyOTP)

router.route('/reset_password')
    .post(adminController.resetPassword);

router.route('/resendOTP')
    .post(adminController.resend_otp);

router.route('/change_password')
    .post(adminController.change_password);

router.route('/edit_profile')
    .post(adminController.editProfile);

router.route('/getUserDetails')
    .get(adminController.getUserDetails);

router.route('/is_user_blocked')
    .post(adminController.isUserBlocked);


exports.Router = router;