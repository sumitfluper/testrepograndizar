const express = require('express');
const router = express.Router();
const serviceController = require('../../controllers/data/serviceController');
const auth = require('../../modules/auth');


// routes to add location 

router.route('/getneworders')
    .post(auth.requiresLogin, serviceController.getAllNewOrder);

//get all order accepted by user type 2,3 
router.route('/getallorderaccepted')
    .post(auth.requiresLogin, serviceController.getAllOrderAccepted);

// get all order created by user type 1
router.route('/getallordercreatedbyme')
    .post(auth.requiresLogin, serviceController.getAllOrderCreated);

    // get all order created by user type 1
router.route('/getallacceptedorderbyme')
    .post(auth.requiresLogin, serviceController.getAllAcceptedOrderByMe);

    // get all order created by user type 1
router.route('/getallcompletedorder')
    .post(auth.requiresLogin, serviceController.getAllCompletedOrder);


router.route("/service_require")
    .post(auth.requiresLogin, serviceController.serviceRequire);

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