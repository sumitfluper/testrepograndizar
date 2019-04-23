const express = require('express');
const router = express.Router();
const offerController = require('../../controllers/data/offerController');


router.route('/makeoffer')
    .post(dataController.makeAnOffer);

exports.Router = router;
