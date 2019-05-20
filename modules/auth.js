// var connection = require ('./connection');
var responses = require ('./responses');
var UserModel = require('../models/User');
var adminModel = require('../models/Admin');


exports.requiresLogin = (req, res, next) => {
    
    let { access_token } = req.headers;
    let { admin_token } = req.headers;
    console.log(admin_token)
    if (access_token) {
        
        UserModel.findOne({access_token})
        .then(result => {
            console.log("UserModel",result);
           if (result) {
            req.user = result;
            req.userId = result._id;
            next();
            } else {
                
                 responses.authenticationErrorResponse(res);
            }
        }).catch(err => {console.log(err);responses.sendError(err.message, res)})
    } 

    
    if (admin_token) {
        
        adminModel.findOne({
            access_token: admin_token
        })
        .then(result => {
            console.log("adminModel",result);
           if (result) {
            req.user = result;
            req.userId = result._id;
            next();
            } else {
                
                 responses.authenticationErrorResponse(res);
            }
        }).catch(err => {console.log(err);responses.sendError(err.message, res)})
    }

    if(!admin_token && !access_token){
        (responses.parameterMissingResponse(res));
        return ;
    }
}

