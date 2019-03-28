// var connection = require ('./connection');
var responses = require ('./responses');
var { adminModel } = require('../models/admin_model');


exports.requiresLogin = (req, res, next) => {
    
    let { access_token } = req.headers;
    console.log(access_token)
    if (access_token) {
        adminModel.findOne({access_token})
        .then(result => {
            console.log(result)
           if (result) {
            req.user = result;
            next();
            } else {
                
                 responses.authenticationErrorResponse(res);
            }
        }).catch(err => {console.log(err);responses.sendError(err.message, res)})
    } else {
        (responses.parameterMissingResponse(res));
        return ;
    }
}

