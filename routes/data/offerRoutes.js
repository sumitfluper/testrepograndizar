const express = require('express');
const router = express.Router();
const offerController = require('../../controllers/data/offerController');
const auth = require('../../modules/auth');


router.route('/makeoffer')
    .post(auth.requiresLogin,offerController.makeAnOffer);

router.route('/getofferlist')
    .get(auth.requiresLogin, offerController.getOfferList);

// get all offers of service
router.route('/getalloffers')
    .post(auth.requiresLogin, offerController.getAllOffers);

   

router.route('/acceptoffer')
    .post(auth.requiresLogin,offerController.acceptOffer);


exports.Router = router;
