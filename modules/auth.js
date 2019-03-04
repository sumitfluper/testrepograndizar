// var connection = require ('./connection');
var responses = require ('./responses');
var {UserModel} = require('../models/user.model.js');


exports.requiresLogin = (req, res, next) => {
    
    let { access_token } = req.headers;
    
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

