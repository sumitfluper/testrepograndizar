// var connection = require ('./connection');
var responses = require ('./responses');
var {UserModel} = require('../models/user.model.js');


exports.requiresLogin = (req, res, next) => {
    console.log ("auth");
    let { access_token } = req.headers;
    console.log(access_token);
    if (access_token) {
        UserModel.findOne({access_token})
        .then(result => {
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

