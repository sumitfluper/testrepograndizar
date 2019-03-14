var express = require('express')
var router = express.Router()
var auth = require('../modules/auth')
var controller = require('../controllers/service_controller')

// //for require service
// router.post('/users/service_require',auth.requiresLogin,controller.service_require);

// //get list of outlets
// router.get('/users/get_nearby_outlets',auth.requiresLogin,controller.get_nearby_outlets)

// module.exports = router;

exports.getRouter = (app) => {

    //for requiring service
    app.route("/users/service_require").post(auth.requiresLogin,controller.service_require);

    //get list of outlets
    app.route("/users/get_nearby_outlets").post(auth.requiresLogin,controller.get_nearby_outlets);

    //active captains
    app.route("/users/active_captains").post(controller.active_captains);

    return app;
}