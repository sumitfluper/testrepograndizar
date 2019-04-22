const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data/dataController');

// routes to add location 

router.route('/addlocation')
    .post(dataController.addNewUserLocation);


router.route('/getsavelocation/:userid')
    .get(dataController.getUserLocation);

exports.Router = router;