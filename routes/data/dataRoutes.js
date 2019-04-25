const express = require('express');
const router = express.Router();
const dataController = require('../../controllers/data/dataController');
const offersController = require('../../controllers/data/offerController');

// routes to add location 

router.route('/addlocation')
    .post(auth.requiresLogin,dataController.addNewUserLocation);


router.route('/getsavelocation')
    .get(auth.requiresLogin,dataController.getUserLocation);


router.route('/makeanoffer')
    .post(auth.requiresLogin,offersController.makeAnOffer);
    

router.route('/acceptoffer')
    .post(auth.requiresLogin,offersController.acceptOffer);

exports.Router = router;