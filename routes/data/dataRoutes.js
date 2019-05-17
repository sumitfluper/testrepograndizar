const express = require('express');
const router = express.Router();
const dataController = require('../../controllers/data/dataController');
const auth = require('../../modules/auth');
// routes to add location 

router.route('/addlocation')
    .post(auth.requiresLogin,dataController.addNewUserLocation);


router.route('/getsavelocation')
    .get(auth.requiresLogin,dataController.getUserLocation);

router.route('/industry')
    .post(auth.requiresLogin,dataController.industry);
router.route('/industry')
    .get(auth.requiresLogin,dataController.industry);
router.route('/industry/:_id')
    .put(auth.requiresLogin,dataController.industry);
router.route('/industry/:_id')
    .delete(auth.requiresLogin,dataController.industry);

router.route('/section')
    .post(auth.requiresLogin,dataController.section);
router.route('/section')
    .get(auth.requiresLogin,dataController.section);
router.route('/section/:_id')
    .put(auth.requiresLogin,dataController.section);
router.route('/section/:_id')
    .delete(auth.requiresLogin,dataController.section);
 
exports.Router = router;