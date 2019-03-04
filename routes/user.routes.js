var auth = require ('../modules/auth');
const users = require('../controllers/user.controller.js');
    var multer = require('multer');
    var path = require('path');
    var md5 = require("md5");
    module.exports = (app) => {
    
    var Storage = multer.diskStorage({
        
         destination: function(req, file, callback) {
            callback(null, './Images')
         },
         filename: function(req, file, callback) {
            let fileUniqName = md5(new Date());
            callback(null, fileUniqName + path.extname(file.originalname))
         }
        
     });
     var upload = multer({
       
        storage: Storage
    })
    
    // Create a new User
    app.post('/users/userSignup', users.userSignup);

    //Create Profile
    app.post('/users/createProfile',auth.requiresLogin, upload.any(), users.createProfile);

    //verify otp

   app.post('/users/varify_otp', users.varify_otp);
   
   // app.post('/users/signup', users.signup);
   
   // app.get('/users/verify_account',users.verify_account);
}