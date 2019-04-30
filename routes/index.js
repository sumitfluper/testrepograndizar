const express = require('express');
const router = express.Router();
//Routes
const adminRoute = require('./admin/adminRoute').Router;
const serviceRoute = require('./data/serviceRoutes').Router;
const userRoute = require('./user/userRoute').Router;
const dataRoute = require('./data/dataRoutes').Router;
const offerRoutes = require('./data/offerRoutes').Router;
//Admin Related Routes.
router.use('/admin', adminRoute);

router.use('/service', serviceRoute);

router.use('/offers', offerRoutes);

router.use('/users', userRoute);

router.use('/data',dataRoute)


module.exports = router;
