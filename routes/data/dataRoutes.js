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
router.route('/getsectionbyindustryid/:_id')
    .get(auth.requiresLogin,dataController.getSectionByIndustry);
router.route('/section/:_id')
    .delete(auth.requiresLogin,dataController.section);


router.route('/vehicletype')
    .post(auth.requiresLogin,dataController.vehicletype);
router.route('/vehicletype')
    .get(auth.requiresLogin,dataController.vehicletype);
router.route('/vehicletype/:_id')
    .put(auth.requiresLogin,dataController.vehicletype);
router.route('/vehicletype/:_id')
    .delete(auth.requiresLogin,dataController.vehicletype);


router.route('/licensetype')
    .post(auth.requiresLogin,dataController.licenseType);
router.route('/licensetype')
    .get(auth.requiresLogin,dataController.licenseType);
router.route('/licensetype/:_id')
    .put(auth.requiresLogin,dataController.licenseType);
router.route('/licensetype/:_id')
    .delete(auth.requiresLogin,dataController.licenseType);


router.route('/govermentid')
    .post(auth.requiresLogin,dataController.govermentIdType);
router.route('/govermentid')
    .get(auth.requiresLogin,dataController.govermentIdType);
router.route('/govermentid/:_id')
    .put(auth.requiresLogin,dataController.govermentIdType);
router.route('/govermentid/:_id')
    .delete(auth.requiresLogin,dataController.govermentIdType);


router.route('/professions')
    .post(auth.requiresLogin, dataController.professions);
router.route('/professions')
    .get(auth.requiresLogin, dataController.professions);
router.route('/professions/:_id')
    .put(auth.requiresLogin, dataController.professions);
router.route('/professions/:_id')
    .delete(auth.requiresLogin, dataController.professions);

router.route('/getprofessionsbysection/:_id')
    .get(auth.requiresLogin, dataController.getProfessionsBySection);
 
exports.Router = router;