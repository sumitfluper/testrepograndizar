const express = require('express');
const router = express.Router();
const serviceController = require('../../controllers/data/serviceController');
const auth = require('../../modules/auth');


// routes to add location 

router.route('/getneworders')
    .post(serviceController.getAllNewOrder);
//get all order accepted by user type 2,3 
router.route('/getallorderaccepted')
    .post(serviceController.getAllOrderAccepted);
// get all order created by user type 1
router.route('/getallordercreatedbyme')
    .post(serviceController.getAllOrderCreated);

router.route("/service_require")
    .post(auth.requiresLogin, serviceController.serviceRequire);

//get list of outlets
router.route("/get_nearby_outlets")
    .post(auth.requiresLogin, serviceController.getNearbyOutlets);

//active captains
router.route("/active_captains")
    .post(serviceController.activeCaptains);

//getCategoryList
router.route("/getCategoryList")
    .get(serviceController.getCategoryList)

//getSubCategoryList
router.route("/getSubCategoryList")
    .get(serviceController.getSubCategoryList)



exports.Router = router;