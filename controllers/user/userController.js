const mongoose = require('mongoose');
const UserModel = require('../../models/User');
const DriverprofileModel = require('../../models/Userdeliveryprofile');
const ProfessionalProfileModel = require('../../models/Userprofessionalprofile');
const Joi = require('joi');
const status = require('../../modules/status');
const md5 = require('md5');
const commFunc = require('../../modules/commonFunction');
const _ = require('lodash');
const responses = require('../../modules/responses');
const uniqueRandom = require('unique-random');
const random = uniqueRandom(1, 10);

exports.userSignup = (req, res) => {
    console.log(req.body);
    const schema = Joi.object().keys({
        mobile_number: Joi.string().optional().error(e => 'Mobile number required'),
        device_token: Joi.string(),
        device_type: Joi.string(),
        longitude: Joi.string(),
        latitude: Joi.string(),
        userType: Joi.number(),
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
        userType,
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
                    userType,
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

                UserModel.findByIdAndUpdate(userData._id, {
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
    console.log(models)
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

// toggele in the notification msg here for delivery boy and professional service
exports.manageNotification = async (req, res) => {

    try {

        console.log(random(), random(), random());

        console.log(req.body);

        if (!req.body.notificationType) {
            res.status(200).send({
                message: "Notification type is missing. Please check"
            })
        }

        if (req.body.status == 'true') {
            var NewStatus = true
        } else {
            var NewStatus = false
        }

        if (req.body.notificationType == '1') {
            // let user = UserModel.findByIdAndUpdate(req.userId, {
            //     $set: {
            //         "isDeliveryBoy": NewStatus
            //     }
            // }, {
            //     new: true
            // })

            let user = await UserModel.findByIdAndUpdate(req.userId, {
                $set: {
                    isDeliveryBoy: NewStatus
                }
            }, {
                new: true
            });

            if (user) {
                res.status(200).send({
                    message: "updated successfully",
                    response: user
                })
            } else {
                res.status(200).send({
                    message: "Unable to update please check and try again",
                    response: []
                })
            }
        }

        if (req.body.notificationType == '2') {
            let user = await UserModel.findByIdAndUpdate(req.userId, {
                $set: {
                    isProfessional: NewStatus
                }
            }, {
                new: true
            })

            if (user) {
                res.status(200).send({
                    message: "updated successfully",
                    response: user
                })
            } else {
                res.status(200).send({
                    message: "Unable to update please check and try again",
                    response: []
                })
            }
        }


    } catch (error) {
        console.error(`*********************${error}*********************`);
        res.status(200).send({
            message: "oops.......! error occured please try again",
            response: error
        })
    }
}


exports.updateUserDeliveryBoyDocuments = async (req, res) => {
    try {

        var existAlredy = await DriverprofileModel.findOne({
            userId: req.userId
        });
        if (existAlredy) {
            var documentsData = req.files;
            var profileData = {
                userId: req.userId ? req.userId : "N/A",
                name: req.body.name ? req.body.name : "N/A",
                about: req.body.about ? req.body.about : "N/A",
                vehicle_type: req.body.vehicle_type ? req.body.vehicle_type : "N/A",
                vehicle_number: req.body.vehicle_number ? req.body.vehicle_number : "N/A",
                insurance_number: req.body.insurance_number ? req.body.insurance_number : "N/A",
                bank_acc_number: req.body.bank_acc_number ? req.body.bank_acc_number : "N/A",
                emergrncy_contact: req.body.emergrncy_contact ? req.body.emergrncy_contact : "N/A",
            }

            for (let index = 0; index < documentsData.length; index++) {
                profileData[documentsData[index].fieldname] = 'users/' + documentsData[index].filename
            }
            var updatedProfile = await DriverprofileModel.findOneAndUpdate({
                userId: req.userId
            },{
                $set:profileData
            },{
                new: true
            })
        } else {
            var documentsData = req.files;
            var profileData = {
                userId: req.userId ? req.userId : "N/A",
                name: req.body.name ? req.body.name : "N/A",
                about: req.body.about ? req.body.about : "N/A",
                vehicle_type: req.body.vehicle_type ? req.body.vehicle_type : "N/A",
                vehicle_number: req.body.vehicle_number ? req.body.vehicle_number : "N/A",
                insurance_number: req.body.insurance_number ? req.body.insurance_number : "N/A",
                bank_acc_number: req.body.bank_acc_number ? req.body.bank_acc_number : "N/A",
                emergrncy_contact: req.body.emergrncy_contact ? req.body.emergrncy_contact : "N/A",
            }

            for (let index = 0; index < documentsData.length; index++) {
                profileData[documentsData[index].fieldname] = 'users/' + documentsData[index].filename
            }
            var driverProfile = new DriverprofileModel(profileData)
            var updatedProfile = await driverProfile.save()
        }



        if (updatedProfile) {
            res.status(200).send({
                message: "Profile Updated Successfully",
                response: updatedProfile
            })
        } else {
            res.status(200).send({
                message: "OOOOOps error occured please try again after some time ",
                response: updatedProfile
            })
        }

    } catch (error) {
        console.error(`***********************error occurred**************************`,error);
        res.status(200).send({
            message: "OOOOOps error occured please try again after some time ",
            response: [error]
        })
    }
}

exports.updateProfessionProfile = async (req, res) => {
    try {

        var existAlready = await ProfessionalProfileModel.findOne({
            userId: req.userId
        })
        if (existAlready) {
            var documentsData = req.files;
            var profileData = {
                name: req.body.name ? req.body.name : "N/A",
                about: req.body.about ? req.body.about : "N/A",
                industry_id: req.body.industry_id ? req.body.industry_id : "N/A",
                section_id: req.body.section_id ? req.body.section_id : "N/A",
                professional_id: req.body.professional_id ? req.body.professional_id : "N/A",
                professional_type_name: req.body.professional_type_name ? req.body.professional_type_name : "N/A",
                goverment_id: req.body.goverment_id ? req.body.goverment_id : "N/A",
                user_profession: req.body.user_profession ? req.body.user_profession : "N/A",
                vehicle_number: req.body.vehicle_number ? req.body.vehicle_number : "N/A",
                bank_acc_number: req.body.bank_acc_number ? req.body.bank_acc_number : "N/A",
                emergrncy_contact: req.body.emergrncy_contact ? req.body.emergrncy_contact : "N/A",
            }

            for (let index = 0; index < documentsData.length; index++) {
                profileData[documentsData[index].fieldname] = 'users/' + documentsData[index].filename
            }
            
            var updatedProfile = await ProfessionalProfileModel.findOneAndUpdate({
                userId: req.userId
            },{
                $set: profileData
            },{
                new: true
            })


        } else {
            var documentsData = req.files;
            var profileData = {
                userId: req.userId ? mongoose.Types.ObjectId(req.userId) : "N/A",
                name: req.body.name ? req.body.name : "N/A",
                about: req.body.about ? req.body.about : "N/A",
                industry_id: req.body.industry_id ? req.body.industry_id : "N/A",
                section_id: req.body.section_id ? req.body.section_id : "N/A",
                professional_id: req.body.professional_id ? req.body.professional_id : "N/A",
                professional_type_name: req.body.professional_type_name ? req.body.professional_type_name : "N/A",
                goverment_id: req.body.goverment_id ? req.body.goverment_id : "N/A",
                user_profession: req.body.user_profession ? req.body.user_profession : "N/A",
                vehicle_number: req.body.vehicle_number ? req.body.vehicle_number : "N/A",
                bank_acc_number: req.body.bank_acc_number ? req.body.bank_acc_number : "N/A",
                emergrncy_contact: req.body.emergrncy_contact ? req.body.emergrncy_contact : "N/A",
            }

            for (let index = 0; index < documentsData.length; index++) {
                profileData[documentsData[index].fieldname] = 'users/' + documentsData[index].filename
            }
            var professionalProfile = new ProfessionalProfileModel(profileData)
            var updatedProfile = await professionalProfile.save()
        }


       
        if (updatedProfile) {
            res.status(200).send({
                message: "Profile Updated Successfully",
                response: updatedProfile
            })
        } else {
            res.status(200).send({
                message: "Oooops error occured please try again after some time ",
                response: updatedProfile
            })
        }

    } catch (error) {
        console.error(`***********************error occurred**************************`,error);
        res.status(200).send({
            message: "Oooops error occured please try again after some time ",
            response: [error]
        })
    }
}

exports.getDeliveryBoyProfile = async (req, res) => {
    try {
        let data = await DriverprofileModel.findOne({
            userId: mongoose.Types.ObjectId(req.userId) 
        }).populate('vehicle_type')
        if (data) {
            res.status(200).send({
                message: "driver profile",
                response: data
            })
        } else {
            res.status(200).send({
                message: "No Data Found",
                response: data
            })
        }
    } catch (error) {
        res.status(200).send({
            message: "OOOOOps error occured please try again after some time ",
            response: [error]
        })
    }
}

exports.getProfessionalBoyProfile = async (req, res) => {
    try {
        let data = await ProfessionalProfileModel.findOne({
            userId: mongoose.Types.ObjectId(req.userId) 
        }).populate('industry_id section_id professional_id goverment_id')
        if (data) {
            res.status(200).send({
                message: "professional profile",
                response: data
            })
        } else {
            res.status(200).send({
                message: "OOOOOps error occured please try again after some time ",
                response: data
            })
        }
    } catch (error) {
        res.status(200).send({
            message: "OOOOOps error occured please try again after some time ",
            response: [error]
        })
    }
}
