const express = require('express');
const router = express.Router();
const serviceController = require('../../controllers/data/serviceController');
const auth = require('../../modules/auth');

// delivery boy api

// routes to add location 
router.route('/deliveryneworder')
    .post(auth.requiresLogin, serviceController.deliveryNewOrder);

// routes to add location 
router.route('/deliverypendingorders')
    .post(auth.requiresLogin, serviceController.deliveryNewOrder);

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
    .post(auth.requiresLogin, serviceController.professionalNewOrder);

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

// get all order created by user type 1
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



exports.Router = router;