const Joi = require('joi')
const responses = require('../../modules/responses')
const commonFunctions = require('../../modules/commonFunction')
const status = require('../../modules/status')
const adminModel = require('../../models/Admin');
const UserModel = require('../../models/User');
const md5 = require('md5')


exports.viewMessage = async (req,res) =>{
    res.status(200).send({
        message: "Please open on https"
    })
}

/**
 * Admin Sign In
 */

exports.adminSignIn = async (req, res) => {
    try {
        console.log("res: reached here",req.body);
        
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

        let userData = await adminModel.findOne({
            email: req.body.email
        })

        if (userData) {

            if (userData.get('password') === md5(req.body.password)) {
                var access_token = md5(new Date());

                var userResult = await adminModel.findByIdAndUpdate({
                    _id: userData._id
                }, {
                    $set: {
                        access_token: access_token,
                        is_verified: 1
                    }
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

/**
 * Admin forget password
 */

exports.forgetPassword = async (req, res) => {
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

        let userData = await adminModel.findOne({
            $and: [{
                "mobile_number": req.body.mobile_number
            }, {
                "country_code": req.body.country_code
            }]
        })
        if (userData) {
            let verification_code = commonFunctions.generateRandomString()
            let userResult = await adminModel.findByIdAndUpdate({
                _id: userData._id
            }, {
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

/**
 * Admin resend otp
 */

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

/**
 * reset password
 */

exports.resetPassword = async (req, res) => {
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



/**
 * send otp again
 */

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


/**
 * change password admin
 */

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


/**
 * admin edit profile
 */

exports.editProfile = async (req, res) => {
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

/**
 * get user list
 */

exports.getUserDetails = async (req, res) => {
    try {
        console.log("hi")
        let data = await UserModel.find()
        res.status(200).json(data)

    } catch (error) {
        responses.sendError(error.message, res)
    }
}

/**
 * isUserBlocked
 */

exports.isUserBlocked = async (req, res) => {
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


exports.getallUsers = async (req, res) => {
    try {
        var data = await UserModel.find();
        if(data){
            res.status(200).send({
                message: "data found",
                response: data
            })
        } else {
            res.status(200).send({
                message:"No Data Found",
                response:[]
            })
        } 
    } catch (error) {
        res.status(422).send({
            message:"error occurred",
            response:error
        })
    }
}

exports.getallDeliveryUser = async (req, res) => {
    try {
        var data = await UserModel.find({
            isDeliveryBoy:true
        });
        if(data){
            res.status(200).send({
                message: "data found",
                response: data
            })
        } else {
            res.status(200).send({
                message:"No Data Found",
                response:[]
            })
        } 
    } catch (error) {
        res.status(422).send({
            message:"error occurred",
            response:error
        })
    }
}

exports.getallProfessionalUser = async (req, res) => {
    try {
        var data = await UserModel.find({
            isProfessional:true
        });
        if(data){
            res.status(200).send({
                message: "data found",
                response: data
            })
        } else {
            res.status(200).send({
                message:"No Data Found",
                response:[]
            })
        } 
    } catch (error) {
        res.status(422).send({
            message:"error occurred",
            response:error
        })
    }
}

exports.getPendingRequest = async (req, res) => {
    try {
        var data = await UserModel.find({
            $and : [
                { $or : [ { is_updated_delivery : 1 }, { is_updated_professional : 1 } ] },
                { $or : [ { isProfessional : false }, { isDeliveryBoy : false } ] }
            ]
        })

        if(data){
            res.status(200).send({
                message: "Pending Request",
                response: data
            })
        } else {
            res.status(200).send({
                message: "No Data Found",
                response:[]
            })
        }

    } catch (error) {
        res.status(200).send({
            message: "Error Occurred"+error,
            response: error
        })        
    }
}