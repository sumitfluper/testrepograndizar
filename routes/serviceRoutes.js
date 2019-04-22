const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/data/serviceController');

// routes to add location 

router.route('/getneworders')
    .post(serviceController.getAllNewOrder);



exports.Router = router;