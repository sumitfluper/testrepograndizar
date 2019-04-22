const express = require('express');
const router = express.Router();
//Routes
const adminRoute = require('./admin/adminRoute').Router;
const serviceRoute = require('./data/serviceRoutes').Router;


//Admin Related Routes.
router.use('/admin', adminRoute);

router.use('/service', serviceRoute);


module.exports = router;
