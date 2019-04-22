const UserModel = require('../../models/User');
const Joi = require('joi');
const status = require('../../modules/status');
const md5 = require('md5');
const commFunc = require('../../modules/commonFunction');
const _ = require('lodash');
const responses = require('../../modules/responses');


exports.userSignup = (req, res) => {
    console.log(req.body);
    const schema = Joi.object().keys({
        mobile_number: Joi.string().optional().error(e => 'Mobile number required'),
        device_token: Joi.string(),
        device_type: Joi.string(),
        longitude: Joi.string(),
        latitude: Joi.string(),
        country_code: Joi.string(),
    })

    const result = Joi.validate(req.body, schema, {
        abortEarly: true
    });
    if (result.error) {
        if (result.error.details && result.error.details[0].message) {
            res.status(status.BAD_REQUEST).json({
                message: result.error.details[0].message
            });
        } else {
            res.status(status.BAD_REQUEST).json({
                message: result.error.message
            });
        }
        return;
    }

    var {
        mobile_number,
        device_token,
        device_type,
        latitude,
        longitude,
        country_code
    } = req.body;
    UserModel.findOne({
            $and: [{
                "mobile_number": mobile_number
            }, {
                "country_code": country_code
            }]
        })
        .then(userResult => {
            if (userResult) {
                // if(userResult.get('mobile_number') == mobile_number) {
                res.status(status.ALREADY_EXIST).json({
                    message: 'Mobile number is already registered'
                })
                // }
            } else {
                var access_token = md5(new Date());
                var created_on = new Date().getTime();
                var modified_on = new Date().getTime();
                let verification_code = commFunc.generateRandomString();
                // let is_verified = '0';
                var updateData = {
                    mobile_number,
                    device_token,
                    device_type,
                    access_token,
                    longitude,
                    latitude,
                    created_on,
                    modified_on,
                    verification_code,
                    country_code
                }
                let user = new UserModel(updateData);
                user.save(updateData)

                    .then((userData) => {

                        //var country_code = userData.country_code;
                        var to = userData.country_code + userData.mobile_number;
                        commFunc.sendotp(verification_code, to);
                        res.status(200).json({
                            message: "SignUp successfull and OTP successfully sent",
                            response: userData
                        })

                    }).catch(err => responses.sendError(err.message, res))
            }

        }).catch(err => responses.sendError(err.message, res))
}

//login

exports.userSignin = (req, res) => {
    const schema = Joi.object().keys({
        mobile_number: Joi.string().optional().error(e => 'Mobile number required'),
        device_token: Joi.string(),
        device_type: Joi.string(),
        longitude: Joi.string(),
        latitude: Joi.string(),
        country_code: Joi.string(),
    })
    console.log(req.body)
    const result = Joi.validate(req.body, schema, {
        abortEarly: true
    });
    if (result.error) {
        console.log(result.error);
        if (result.error.details && result.error.details[0].message) {
            res.status(status.BAD_REQUEST).json({
                message: result.error.details[0].message
            });
        } else {
            res.status(status.BAD_REQUEST).json({
                message: result.error.message
            });
        }
        return;
    }

    var {
        mobile_number,
        device_token,
        device_type,
        latitude,
        longitude,
        country_code
    } = req.body;


    UserModel.findOne({
            $and: [{
                "country_code": country_code
            }, {
                "mobile_number": mobile_number
            }]
        })
        .then(userData => {
            if (userData) {
                console.log(userData);
                if (userData.is_blocked === 1) {
                    res.status(403).json({
                        message: "Blocked by admin"
                    })
                    return
                }
                var access_token = md5(new Date());
                var verification_code = commFunc.generateRandomString();
                let is_verified = '0';
                var updateData = {
                    device_token,
                    device_type,
                    latitude,
                    longitude,
                    access_token,
                    verification_code,
                    country_code,
                    is_verified
                }

                UserModel.findByIdAndUpdate(userData.get('_id'), {
                        $set: updateData
                    }, {
                        new: true
                    })
                    .then(userResult => {


                        var to = userResult.country_code + userResult.mobile_number;
                        commFunc.sendotp(verification_code, to);
                        res.status(200).json({
                            message: "Login successfull and OTP sent successfully",
                            response: userResult
                        });

                    }).catch(err => responses.sendError(err.message, res));

                // } else {
                //     res.status(403).json({ message: 'mobile number not registered' });
                // }
            } else {

                res.status(403).json({
                    message: 'Mobile number not registered'
                });

            }

        }).catch(err => {
            console.log(err);
            responses.sendError(err.message, res)
        });

}
//verify_otp

exports.varify_otp = (req, res) => {

    let {
        verification_code
    } = req.body;
    let {
        access_token
    } = req.headers;
    UserModel.findOne({
            access_token
        })
        .then(userResult => {
            if (userResult) {
                if (userResult.get('verification_code') == verification_code) {
                    let _id = userResult.get('_id')
                    verification_code = '';
                    var is_verified = 1;
                    UserModel.findByIdAndUpdate(_id, {
                            $set: {
                                verification_code,
                                is_verified
                            }
                        }, {
                            new: true
                        })
                        .then(userData => {
                            res.status(200).json({
                                message: "Verification successfull.",
                                response: userData
                            })
                        }).catch(err => {
                            console.log(err);
                            responses.sendError(err.message, res)
                        })
                } else {
                    res.status(status.INVALID_CREDENTIAL).json({
                        message: 'Verification code is not correct.'
                    });
                }
            } else {
                res.status(status.INVALID_CREDENTIAL).json({
                    message: 'Mobile number not exist.'
                });
            }
        }).catch(err => {
            console.log(err);
            responses.sendError(err.message, res)
        })
};



//create profile

exports.createProfile = (req, res) => {
    console.log(req.body)
    const schema = Joi.object().keys({
        //  mobile_number: Joi.string().optional().error(e => 'Mobile number required.'),
        name: Joi.string(),
        user_name: Joi.string(),
        email: Joi.string().required(),
        dob: Joi.string(),
        is_username: Joi.string().optional().default(''),
        gender: Joi.string(),
        app_langauge: Joi.string(),
        speak_langauge: Joi.string(),

    })

    const result = Joi.validate(req.body, schema, {
        abortEarly: true
    });
    if (result.error) {
        if (result.error.details && result.error.details[0].message) {
            res.status(status.BAD_REQUEST).json({
                message: result.error.details[0].message
            });
        } else {
            res.status(status.BAD_REQUEST).json({
                message: result.error.message
            });
        }
        return;
    }
    var {
        email,
        app_langauge,
        speak_langauge,
        name,
        user_name,
        is_username,
        dob,
        gender
    } = req.body;
    console.log(req.body)
    var access_token = req.user.access_token;


    var modified_on = new Date().getTime();
    var is_profile_created = '1';
    if (req.files.length)
        var profile_image = `/users/${req.files[0].filename}`;

    if (!user_name) {
        //console.log("user_name not comming")

        var updateData = {
            email,
            app_langauge,
            speak_langauge,
            name,
            is_profile_created,
            dob,
            gender,
            profile_image,
            modified_on
        };
        UserModel.findOneAndUpdate({
                access_token
            }, {
                $set: updateData
            }, {
                new: true
            })
            .then(userData => {
                res.status(status.SUCCESS_STATUS).json({
                    message: "Profile created.",
                    response: userData
                })
            }).catch(err => {
                console.log(err);
                responses.sendError(err.message, res)
            })


    } else {
        //console.log("userna comming")
        UserModel.findOne({
                'user_name': user_name
            })
            .then(userResult => {

                if (userResult) {
                    if (userResult.get('user_name') == user_name) {
                        res.status(status.ALREADY_EXIST).json({
                            message: 'Username already exist'
                        });
                    }
                } else {
                    var updateData = {
                        email,
                        app_langauge,
                        speak_langauge,
                        user_name,
                        is_profile_created,
                        dob,
                        gender,
                        profile_image,
                        modified_on
                    };
                    UserModel.findOneAndUpdate({
                            access_token
                        }, {
                            $set: updateData
                        }, {
                            new: true
                        })
                        .then(userData => {
                            res.status(status.SUCCESS_STATUS).json({
                                message: "Profile Created.",
                                response: userData
                            })
                        }).catch(err => {
                            console.log(err);
                            responses.sendError(err.message, res)
                        })
                }
            }).catch(err => {
                console.log(err);
                responses.sendError(err.message, res)
            });
    }
};


//console.log("working")

exports.signup = async (req, res) => {
    try {
        let {
            mobile_number
        } = req.body;
        let data = await UserModel.findOne({
            mobile_number
        });
        if (data) {
            throw new Error('Mobile already exist')
        }
        let newModel = UserModel({
            mobile_number
        })
        let saveData = await newModel.save();
        if (!saveData) {
            throw new Error('unable to insert')
        }
        console.log('success.')
        res.status(status.SUCCESS_STATUS).json({
            message: "profile Created.",
            response: saveData
        })
    } catch (error) {

    }
}

exports.verify_account = async (req, res) => {
    try {
        let {
            access_token
        } = req.query;
        let new_access_token = md5(new Date());
        let data = await UserModel.findOneAndUpdate({
            access_token
        }, {
            is_verified: 1,
            access_token: new_access_token
        }, {
            new: true
        }).exec()
        if (!data) {
            throw new Error('session expire')
        }
        console.log(updateData)
        res.status(status.SUCCESS_STATUS).json({
            message: "account verified"
        })
        console.log("success");
    } catch (error) {
        responses.sendError(error.message, res);
    }
}

//recent otp

exports.resend_otp = (req, res) => {

    var {
        mobile_number,
        country_code
    } = req.body;
    const schema = Joi.object().keys({
        mobile_number: Joi.string().optional().error(e => 'Mobile number required.'),
        country_code: Joi.string(),
    })

    const result = Joi.validate(req.body, schema, {
        abortEarly: true
    });
    if (result.error) {
        if (result.error.details && result.error.details[0].message) {
            res.status(status.BAD_REQUEST).json({
                message: result.error.details[0].message
            });
        } else {
            res.status(status.BAD_REQUEST).json({
                message: result.error.message
            });
        }
        return;
    }

    UserModel.findOne({
            mobile_number
        })
        .then(userData => {
            if (!userData) {
                //console.log("invalid mobile number")
                res.status(status.BAD_REQUEST).json({
                    message: "Invalid mobile number"
                });
                return;
            }
            // console.log("=================",userData)
            var verification_code = commFunc.generateRandomString();
            var to = country_code + mobile_number;
            var updateData = {
                mobile_number,
                country_code,
                verification_code
            }
            commFunc.sendotp(verification_code, to);
            res.status(200).json({
                message: "OTP sent successfully",
                response: updateData
            });


        }).catch(err => {
            console.log(err);
            responses.sendError(err.message, res)
        });



}
