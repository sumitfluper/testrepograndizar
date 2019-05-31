const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController');
router.route('/')
    .get(adminController.viewMessage);
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

router.route('/getallusers')
    .get(adminController.getallUsers);
router.route('/getalldelivery')
    .get(adminController.getallDeliveryUser);
router.route('/getallprofessional')
    .get(adminController.getallProfessionalUser);

router.route('/getpendingrequest')
    .get(adminController.getPendingRequest);

router.route('/viewpendingdelivery')
    .post(adminController.viewPendingDelivery);

router.route('/viewpendingprofessional')
    .post(adminController.viewPendingProfessional);


exports.Router = router;