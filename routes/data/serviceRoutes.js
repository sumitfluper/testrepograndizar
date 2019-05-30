const express = require('express');
const router = express.Router();
const serviceController = require('../../controllers/data/serviceController');
const auth = require('../../modules/auth');
const multer = require('multer');
const md5 = require('md5');
const path = require('path');


const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './Images/chatimage');
	},
	filename: function (req, file, callback) {
		let fileUniqueName = md5(Date.now());
		callback(null, fileUniqueName + path.extname(file.originalname));
	}
})

const storageInvoce = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './Images/invoice');
	},
	filename: function (req, file, callback) {
		let fileUniqueName = md5(Date.now());
		callback(null, fileUniqueName + path.extname(file.originalname));
	}
})


let upload = multer({
	storage: storage
});

let uploadInvoce = multer({
	storage: storageInvoce
});

// delivery boy api

// routes to add location 
router.route('/deliveryneworder')
    .post(auth.requiresLogin, serviceController.deliveryNewOrder);

// routes to add location 
router.route('/deliverypendingorders')
    .post(auth.requiresLogin, serviceController.deliveryPendingOrder);

// get all order created by user type 1
router.route('/deliveryacceptedorders')
    .post(auth.requiresLogin, serviceController.deliveryAcceptedOrders);

// get all order created by user type 1
router.route('/deliverycompletedorder')
    .post(auth.requiresLogin, serviceController.deliveryCompletedOrder);


// routes to add location 
router.route('/professionalneworder')
    .post(auth.requiresLogin, serviceController.professionalNewOrder);

// routes to add location 
router.route('/professionalpendingorders')
    .post(auth.requiresLogin, serviceController.professionalpendingorders);

// get all order created by user type 1
router.route('/professionalacceptedorders')
    .post(auth.requiresLogin, serviceController.professionalAcceptedOrders);

// get all order created by user type 1
router.route('/professionalcompletedorder')
    .post(auth.requiresLogin, serviceController.professionalCompletedOrder);


// users api     

// get all order created by user type 1
router.route('/userpendingorders')
    .post(auth.requiresLogin, serviceController.getUserPendingOrders);

// get all order created by user type 1
router.route('/getuseracceptedorder')
    .post(auth.requiresLogin, serviceController.getUserAcceptedOrder);

// get all order  created by user type 1
router.route('/getusercompletedorder')
    .post(auth.requiresLogin, serviceController.getUserCompletedOrder);


// get all order created by user type 1
router.route('/acceptoffer')
    .post(auth.requiresLogin, serviceController.acceptService);



router.route("/service_require")
    .post(auth.requiresLogin, serviceController.serviceRequire);

// cancel order by user 
router.route("/usercancelservice")
    .post(auth.requiresLogin, serviceController.cancelServiceByUser);

//get list of outlets
router.route("/get_nearby_outlets")
    .post(auth.requiresLogin, serviceController.getNearbyOutlets);

//active captains
router.route("/active_captains")
    .post(auth.requiresLogin, serviceController.activeCaptains);

//getCategoryList
router.route("/getCategoryList")
    .get(auth.requiresLogin, serviceController.getCategoryList)

//getSubCategoryList
router.route("/getSubCategoryList")
    .get(auth.requiresLogin, serviceController.getSubCategoryList)


//change delivery staus
router.route("/updateservicestatus")
    .post(auth.requiresLogin, serviceController.updateServiceStatus)


//change delivery staus
router.route("/uploadimageonchat")
    .post(auth.requiresLogin,upload.any(), serviceController.uploadImageonchat)

//change delivery staus
router.route("/sendchatnotification")
    .post(auth.requiresLogin, serviceController.sendChatNotification)
//change delivery staus
router.route("/workdone")
    .post(auth.requiresLogin, serviceController.workDone)

    //change delivery staus
router.route("/createinvoice")
    .post(auth.requiresLogin,uploadInvoce.any(), serviceController.createInvoice)



exports.Router = router;