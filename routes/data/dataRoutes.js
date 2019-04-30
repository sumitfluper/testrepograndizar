const express = require('express');
const router = express.Router();
const dataController = require('../../controllers/data/dataController');
const auth = require('../../modules/auth');
// routes to add location 

router.route('/addlocation')
    .post(auth.requiresLogin,dataController.addNewUserLocation);


router.route('/getsavelocation')
    .get(auth.requiresLogin,dataController.getUserLocation);

 
exports.Router = router;