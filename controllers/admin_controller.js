var Joi = require('joi')
var async = require('async')
var responses = require('../modules/responses')
var commonFunctions = require('../modules/commonFunction')
var status = require('../modules/status')
var { adminModel } = require('../models/admin_model')
var { UserModel } = require('../models/user.model')
var md5 = require('md5')


/*--------------------------------------
+++++++++ USER SIGNIN ++++++++++++
---------------------------------------*/

exports.admin_signin = async (req, res) => {

    try {

        const schema = Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().required(),
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
            password
        } = req.body
        console.log(req.body, "=========")

        let userData = await adminModel.findOne({
            email
        })
        if (userData) {
            console.log(userData)

            if (userData.get('password') === md5(password)) {
                var access_token = md5(new Date());
                let is_verified = 1
                var updateData = {
                    access_token,
                    is_verified
                }
                var userResult = await adminModel.findByIdAndUpdate(userData.get('_id'), {
                    $set: updateData
                }, {
                    new: true
                })
                if (userResult) {
                    res.status(200).json({
                        message: "Login successfully",
                        response: userResult
                    });
                } else {
                    res.status(status.INVALID_CREDENTIAL).json({
                        message: 'Email not registered'
                    });
                }
            } else {
                res.status(status.INVALID_CREDENTIAL).json({
                    message: 'Invalid password'
                });
            }
        } else {
            res.status(status.INVALID_CREDENTIAL).json({
                message: 'Invalid credentials'
            });
        }

    } catch (error) {
        responses.sendError(error.message, res)
    }

}

/*--------------------------------------
+++++++++ FORGET PASSWORD ++++++++++++
---------------------------------------*/

exports.forget_password = async (req, res) => {
    try {
        const schema = Joi.object().keys({
            country_code: Joi.string().required(),
            mobile_number: Joi.string().required()
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
            country_code,
            mobile_number
        } = req.body;
        console.log(req.body)
        let userData = await adminModel.findOne({
            $and: [{
                "mobile_number": mobile_number
            }, {
                "country_code": country_code
            }]
        })
        if (userData) {
            let verification_code = commonFunctions.generateRandomString()
            let userResult = await adminModel.findByIdAndUpdate(userData.get('_id'), {
                $set: {
                    verification_code
                }
            }, {
                new: true
            })
            if (userResult) {
                let to = country_code + mobile_number
                commonFunctions.sendotp(verification_code, to)
                res.status(200).json({
                    message: "Verification code sent successfully",
                    response: userResult
                })
            } else {
                res.status(status.NOT_FOUND).json({
                    message: "Invalid credentials"
                })
            }
        } else {
            res.status(status.NOT_FOUND).json({
                message: "Invalid credentials"
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}

/*--------------------------------------
+++++++++ VERIFY OTP  ++++++++++++
---------------------------------------*/

exports.verifyOTP = async (req, res) => {
    try {
        var {
            verification_code
        } = req.body;
        var {
            access_token
        } = req.headers;
        console.log(req.body)
        console.log(access_token)
        let userData = await adminModel.findOne({
            access_token
        })
        if (userData) {
            console.log(userData)
            if (userData.get('verification_code') === verification_code) {
                verification_code = ""
                is_verified = 1
                let updateData = {
                    verification_code,
                    is_verified
                }
                let userResult = await adminModel.findOneAndUpdate({
                    access_token
                }, {
                    $set: updateData
                }, {
                    new: true
                })
                if (userResult) {
                    console.log(userResult)
                    res.status(200).json({
                        message: "OTP verified",
                        response: userResult
                    })
                } else {
                    res.status(status.INVALID_CREDENTIAL).json({
                        message: "Invalid credentials 1"
                    })
                }
            } else {
                res.status(status.INVALID_CREDENTIAL).json({
                    message: "Invalid credentials 2"
                })
            }
        } else {
            res.status(status.INVALID_CREDENTIAL).json({
                message: "Invalid credentials 3"
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}

/*--------------------------------------
+++++++++ RESET PASSWORD ++++++++++++
---------------------------------------*/

exports.reset_password = async (req, res) => {
    try {
        var {
            password
        } = req.body;
        var {
            access_token
        } = req.headers;
        let userResult = await adminModel.findOneAndUpdate({
            access_token
        }, {
            $set: {
                password: md5(password)
            }
        }, {
            new: true
        })
        if (userResult) {
            res.status(200).json({
                message: "Reset password successfully",
                response: userResult
            })

        } else {
            res.status(status.INVALID_CREDENTIAL).json({
                message: "Invalid credentials3"
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}

/*--------------------------------------
+++++++++ RESEND OTP ++++++++++++
---------------------------------------*/

exports.resend_otp = async (req, res) => {
    try {
        var {
            mobile_number,
            country_code
        } = req.body
        let userData = await adminModel.findOne({
            $and: [{
                "country_code": country_code
            }, {
                "mobile_number": mobile_number
            }]
        })
        if (userData) {

            let verification_code = commonFunctions.generateRandomString()
            let to = country_code + mobile_number
            //send OTP
            commonFunctions.sendotp(verification_code, to);
            res.status(200).json({
                message: "OTP sent successfully",
                response: userData
            })
        } else {
            res.status(status.INVALID_CREDENTIAL).json({
                message: "Invalid mobile number"
            })
        }

    } catch (error) {
        responses.sendError(error.message, res);
    }
}

/*--------------------------------------
+++++++++ CHANGE PASSWORD ++++++++++++
---------------------------------------*/

exports.change_password = async (req, res) => {
    try {

        var access_token = req.user.access_token
        console.log("Access " + access_token)
        var passwordb = req.user.password;
        console.log(passwordb)
        var {
            old_password,
            new_password
        } = req.body
        console.log("+++++++++++++++" + new_password, old_password)
        if (passwordb == md5(old_password)) {
            let userData = await adminModel.findOneAndUpdate({
                access_token
            }, {
                $set: {
                    password: md5(new_password)
                }
            }, {
                new: true
            })
            if (userData) {
                res.status(200).json({
                    message: "Password changed successfully",
                    response: userData
                })
            } else {
                res.status(status.INVALID_CREDENTIAL).json({
                    message: "Invalid credentials"
                })
            }
        } else {
            res.status(status.INVALID_CREDENTIAL).json({
                message: "Incorrect old password"
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}


/*--------------------------------------
+++++++++   EDIT PROFILE ++++++++++++
---------------------------------------*/

exports.edit_profile = async (req, res) => {
    try {
        console.log("hi!!!! " + req.files)
        var access_token = req.user.access_token
        var {
            First_name,
            Last_name,
            mobile_number,
            email
        } = req.body
        var data = req.body
        console.log(data)
        req.files.forEach(file => {
            data[file.fieldname] = `/admin/${file.filename}`;
        });
        let userData = await adminModel.findOneAndUpdate({
            access_token
        }, {
            $set: data
        }, {
            new: true
        })
        if (userData) {
            res.status(200).json({
                message: "Profile edited successfully",
                response: userData
            })
        } else {
            res.status(status.INVALID_CREDENTIAL).json({
                message: "Invalid credentials"
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}


/*--------------------------------------
+++++++++ GET USER DETAILS ++++++++++++
---------------------------------------*/

exports.getUserDetails = async (req, res) => {
    try {
        console.log("hi")
        let data = await UserModel.find()
        res.status(200).json(data)

    } catch (error) {
        responses.sendError(error.message, res)
    }
}

/*--------------------------------------
+++++++++ IS BLOCKED ++++++++++++
---------------------------------------*/

exports.is_user_blocked = async (req, res) => {
    try {
        console.log("hi! kaise ho")
        let {
            _id,
            is_blocked
        } = req.body
        console.log(req.body)
        // if(is_blocked === 0 ) {
        var updateData = {
            is_blocked
        }
        // }else if(is_blocked === 1){
        //    var updateData = { is_blocked : 0 }
        // }
        let adminData = await UserModel.findByIdAndUpdate({
            _id
        }, {
            $set: updateData
        }, {
            new: true
        })
        if (adminData) {
            res.status(200).json({
                message: "",
                response: adminData
            })
        } else {
            res.status(status.INVALID_CREDENTIAL).json({
                message: "Invalid credentials"
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}