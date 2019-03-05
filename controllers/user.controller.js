const {UserModel} = require('../models/user.model.js');
 const Joi = require('joi');
var status = require('../modules/status');
const md5 = require('md5');
var commFunc = require('../modules/commonFunction');
var _ = require('lodash');
var responses = require('../modules/responses');
var async = require("async");
/*
exports.userSignup = (req, res) => {
        
    // Signup a User
            const schema = Joi.object().keys({
            mobile_number: Joi.string().optional().error(e => 'Mobile number required.'),
            device_token: Joi.string().required(),
            device_type: Joi.number().required(),
            latitude: Joi.string(),
            longitude: Joi.string(),
            country_code: Joi.string(),
            
        })
        
         const result = Joi.validate(req.body, schema, { abortEarly: true });
        if (result.error) {
            if (result.error.details && result.error.details[0].message) {
                res.status(status.BAD_REQUEST).json({ message: result.error.details[0].message });
            } else {
                res.status(status.BAD_REQUEST).json({ message: result.error.message });
            }
            return;
        }
        
    
    // Check existing data 	
        var {mobile_number, country_code, device_token, device_type, latitude, longitude} = req.body;
        UserModel.findOne({ 'mobile_number': mobile_number })
            .then(data => {
                if (data) {
                    if(data.mobile_number == mobile_number)
                    {
                    var access_token = md5(new Date());
                    var modified_on = new Date().getTime();
                    let verification_code = commFunc.generateRandomString();
                    let is_verified = '0';
                    var updateData = {modified_on,latitude, longitude, access_token,is_verified, verification_code};
                    UserModel.findByIdAndUpdate(data._id, {$set : updateData}, {new:true})
                       .then((updateData) => {
                           var verification_code = data.verification_code;
                           var sendTo = country_code + data.mobile_number;
                           console.log(sendTo)
                            commFunc.sendotp(verification_code,sendTo);
                            let newData = JSON.parse(JSON.stringify(updateData))    ;// convert into string than convert in json
                            newData['type'] = 1
                         res.status(status.SUCCESS_STATUS).json({ message: " Hey Verification Code sent to your Mobile Number ",response: newData })
        }).catch(err => {
            res.status(status.SERVER_ERROR).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
                       }       
                   } 


                else {
                    var access_token = md5(new Date());
                    var created_on = new Date().getTime();
                    var modified_on = new Date().getTime();
                    let is_verified = '0';
                    let verification_code = commFunc.generateRandomString();
                    var updateData = {mobile_number, country_code, created_on, modified_on, device_token,is_verified, created_on, modified_on, device_type, latitude, longitude, access_token, verification_code};
    
                    const user = new UserModel(updateData);
                    user.save(updateData)
                        .then((updateData) => {
                            var verification_code = updateData.verification_code;
                            var country_code = updateData.country_code;
                            var sendTo = country_code+updateData.mobile_number;
                             commFunc.sendotp(verification_code,sendTo);
                            //  let newData = JSON.parse(JSON.stringify(updateData))    ;// convert into string than convert in json
                            // newData['type'] = 0
                            res.status(status.SUCCESS_STATUS).json({ message: "Verification Code sent to your Mobile Number ",response: newData })
        }).catch(err => {
            res.status(status.SERVER_ERROR).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
        }
    });
};
    
  */

 exports.userSignup = (req , res) => {
    const schema = Joi.object().keys({
        mobile_number: Joi.string().optional().error(e => 'mobile number required'),
        device_token: Joi.string(),
        device_type: Joi.string(),
        longitude: Joi.string(),
        latitude: Joi.string(),
        country_code: Joi.string(),
    })

    const result = Joi.validate(req.body, schema, {abortEarly: true});
    if(result.error) {
        if (result.error.details && result.error.details[0].message) {
            res.status(status.BAD_REQUEST).json({ message: result.error.details[0].message });
        } else {
            res.status(status.BAD_REQUEST).json({ message: result.error.message });
        }
        return;
    }

    var { mobile_number, device_token, device_type, latitude,longitude,country_code } = req.body;
    UserModel.findOne({ "mobile_number" : mobile_number })
            .then(userResult => {
                if(userResult) {
                        if(userResult.get('mobile_number') == mobile_number) {
                                     res.status(status.ALREADY_EXIST).json({ message: 'Your mobile number is already registered' })
                        }
                } else {
                            var access_token = md5(new Date());
                            var created_on =  new Date().getTime();
                            var modified_on = new Date().getTime();
                            let verification_code = commFunc.generateRandomString();
                            
                            var updateData = {  mobile_number, device_token, device_type,access_token, longitude,latitude,created_on,modified_on,verification_code,country_code}
                            let user = new UserModel(updateData);
                            user.save(updateData)
                
                            .then((userData) => {
                                                    
                                                    var country_code = userData.country_code;
                                                    var to = country_code+userData.mobile_number;
                                                    commFunc.sendotp( verification_code , to);
                                                    res.status(200).json({ message: "SignUp successfully and otp successfully sent", response: userData})

                                                }).catch(err=>  responses.sendError(err.message,res))
                        }
                    
                }).catch(err=>  responses.sendError(err.message,res))
    }

    //login

    exports.userSignin = (req,res)=> {
        const schema = Joi.object().keys({
            mobile_number: Joi.string().optional().error(e=> 'mobile number required'),
            device_token: Joi.string(),
            device_type: Joi.string(), 
            longitude: Joi.string(),
            latitude: Joi.string(),
            country_code:Joi.string(),
        })

        const result = Joi.validate(req.body, schema, {abortEarly: true});
        if(result.error) {
            if (result.error.details && result.error.details[0].message) {
                res.status(status.BAD_REQUEST).json({ message: result.error.details[0].message });
            } else {
                res.status(status.BAD_REQUEST).json({ message: result.error.message });
            }
            return;
        }

        var {mobile_number, device_token, device_type, latitude, longitude,country_code} = req.body;
        UserModel.findOne({ mobile_number })
                .then(userData => {
                    if(userData){
                                if(userData.get('mobile_number') == mobile_number)
                                {
                        
                                    var access_token = md5(new Date());
                                    var verification_code = commFunc.generateRandomString();
                                    var updateData = {device_token, device_type,latitude,longitude,access_token,verification_code,country_code}
                                    console.log(updateData);
                                    UserModel.findByIdAndUpdate(userData.get('_id'), { $set : updateData }, { new : true})
                                    .then(userResult => { 
                                                           
                                                            var country_code = userData.country_code;
                                                            var to = country_code+userData.mobile_number;
                                                            commFunc.sendotp( verification_code , to);
                                                            res.status(200).json({ message: "login successfully and otp sent successfully", response:userResult});
                                                
                                                        }).catch(err => responses.sendError(err.message,res));
                                
                                }else {

                                        res.status(status.INVALID_CREDENTIALS).json({ message: 'mobile number not registered' });

                                      }
                    }else {

                                res.status(status.INVALID_CREDENTIALS).json({ message: 'mobile number not registered' });
                                        
                    }
                        
                }).catch(err => 
                        responses.sendError(err.message,res));
}
//verify_otp

exports.varify_otp = (req, res) => {
   
   let {  verification_code} = req.body;
    let {access_token} = req.headers;
    UserModel.findOne({ access_token})
        .then(userResult => {
            if (userResult) {
                if (userResult.get('verification_code') == verification_code) {
                    let _id = userResult.get('_id')
                    verification_code = '';
                    var is_verified = 1;
                    UserModel.findByIdAndUpdate(_id, { $set: { verification_code, is_verified } }, { new: true })
                        .then(userData => {
                            res.status(200).json({ message: "Verification successfull.", response: userData })
                        }).catch(err => { console.log(err); responses.sendError(err.message, res) })
                } else {
                    res.status(status.INVALID_CREDENTIAL).json({ message: 'verification code is not correct.' });
                }
            } else {
                res.status(status.INVALID_CREDENTIAL).json({ message: 'Mobile Number is not exist.' });
            }
        }).catch(err => { console.log(err); responses.sendError(err.message, res) })
};



//create profile

exports.createProfile = (req, res) => {
    console.log(req.body)
        const schema = Joi.object().keys({
      //  mobile_number: Joi.string().optional().error(e => 'Mobile number required.'),
        name: Joi.string(),
        user_name:Joi.string(),
        email: Joi.string().required(),
        dob: Joi.string(),
        is_username:Joi.string().required(),
        gender: Joi.string(),
        app_language:Joi.string(),
        speak_language:Joi.string(),
       
    })
    
    const result = Joi.validate(req.body, schema, { abortEarly: true });
    if (result.error) {
        if (result.error.details && result.error.details[0].message) {
            res.status(status.BAD_REQUEST).json({ message: result.error.details[0].message });
        } else {
            res.status(status.BAD_REQUEST).json({ message: result.error.message });
        }
        return;
    }
    var {email, app_language, speak_language, name,user_name, is_username, dob, gender } = req.body;
                    var access_token   = req.user.access_token;

                    
                    var modified_on = new Date().getTime();
                    var is_profile_created = '1';
                    if(req.files.length)
                    var profile_image = `./Images/${req.files[0].filename}`;
                     
    if(is_username==0)
    {
                    
                    var updateData = {email,app_language,speak_language, name,is_profile_created, dob, gender,profile_image, modified_on};
                    UserModel.findOneAndUpdate({access_token}, { $set: updateData }, { new: true })
                        .then(userData => {
                            res.status(status.SUCCESS_STATUS).json({ message: "profile Created.", response: userData })
                        }).catch(err => { console.log(err); responses.sendError(err.message, res) })


         }
else
  {
    UserModel.findOne({ 'user_name': user_name })
        .then(userResult => {
           
            if (userResult) {
                if (userResult.get('user_name') == user_name) {
                    res.status(status.ALREADY_EXIST).json({ message: 'username already exists please try another.' });
                }
            }
          else{
                var updateData = {email,app_language,speak_language, user_name,is_profile_created, dob, gender,profile_image,  modified_on };
                 UserModel.findOneAndUpdate({access_token}, { $set: updateData }, { new: true })
                  .then(userData => {
           res.status(status.SUCCESS_STATUS).json({ message: "profile Created.", response: userData })
       }).catch(err => { console.log(err); responses.sendError(err.message, res) })
    }
}).catch(err => { console.log(err); responses.sendError(err.message, res) });
}
            };
            
    
//console.log("working")

exports.signup = async(req, res) => {
    try {
        let {mobile_number} = req.body;
        let data = await UserModel.findOne({mobile_number});
        if(data) {
            throw new Error('Mobile already exist')
        } 
        let newModel = UserModel({mobile_number}) 
        let saveData = await newModel.save();
        if(!saveData) {
            throw new Error('unable to insert')
        } console.log('success.')
        res.status(status.SUCCESS_STATUS).json({ message: "profile Created.", response: saveData })
    } catch(error) {
         
    }
}

exports.verify_account = async(req,res) => {
   try{
    let {access_token} = req.query;
    let new_access_token = md5(new Date());
    let data = await UserModel.findOneAndUpdate({ access_token }, { is_verified : 1, access_token : new_access_token}, {new : true}).exec()
    if(!data){
        throw new Error('session expire')
    }
    console.log(updateData)
    res.status(status.SUCCESS_STATUS).json({ message: "account verified"})
    console.log("success");
   }catch(error) {
    responses.sendError(error.message, res) ;
   }
}

//recent otp

exports.resend_otp = (req, res) => {
    
    var { mobile_number, country_code} =req.body;
    const schema = Joi.object().keys({
        mobile_number: Joi.string().optional().error(e => 'Mobile number required.'),
        country_code: Joi.string(),
    })

    const result = Joi.validate(req.body, schema, {abortEarly: true});
    if(result.error) {
        if (result.error.details && result.error.details[0].message) {
            res.status(status.BAD_REQUEST).json({ message: result.error.details[0].message });
        } else {
            res.status(status.BAD_REQUEST).json({ message: result.error.message });
        }
        return;
    }
    
    UserModel.findOne({mobile_number})
    .then(userData => {
        if( !userData) {
            //console.log("invalid mobile number")
            res.status(status.BAD_REQUEST).json({ message: "Invalid mobile" });
            return;
        }
       // console.log("=================",userData)
        var verification_code = commFunc.generateRandomString();
        var to = country_code + mobile_number;
        var updateData = {mobile_number, country_code, verification_code }
        commFunc.sendotp(verification_code,to);
        res.status(200).json({ message: "otp sent again successfully", response:updateData});


    }).catch(err => { console.log(err); responses.sendError(err.message, res) });
    
    

} 