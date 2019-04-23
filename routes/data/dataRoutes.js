const express = require('express');
const router = express.Router();
const dataController = require('../../controllers/data/dataController');
const offersController = require('../../controllers/data/offerController');

// routes to add location 

router.route('/addlocation')
    .post(dataController.addNewUserLocation);


router.route('/getsavelocation/:userid')
    .get(dataController.getUserLocation);


router.route('/makeanoffer')
    .post(offersController.makeAnOffer);
    

router.route('/acceptoffer')
    .post(offersController.acceptOffer);

exports.Router = router;