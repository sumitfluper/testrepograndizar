const Joi = require('joi')
const responses = require('../../modules/responses')
const commonFunctions = require('../../modules/commonFunction')
const status = require('../../modules/status')
const mongoose = require('mongoose');
const adminModel = require('../../models/Admin');
const UserModel = require('../../models/User');
const DeliveryprofileModel = require('../../models/Userdeliveryprofile');
const ProfessionalprofileModel = require('../../models/Userprofessionalprofile');
const md5 = require('md5')
const serviceModel = require('../../models/Service');
const categoryModel = require('../../models/Category');
const subCategoryModel = require('../../models/subcategories');
const professionalModel = require('../../models/Professional');
const offersData = require('../../models/Offerbyuser');

const viewingPetId = mongoose.Types.ObjectId("515535b6760fe8735f5f6899");


exports.viewMessage = async (req,res) =>{
    res.status(200).send({
        message: "Please open on https"
    })
}

/**
 * Admin Sign In
 * dsjk
 * sasd
 * dsdas
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

exports.viewPendingDelivery = async (req, res) => {
    try {
        var data = await DeliveryprofileModel.findOne({
            userId: req.body.userId
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

exports.viewPendingProfessional = async (req, res) => {
    try {
        var data = await ProfessionalprofileModel.findOne({
            userId:req.body.userId
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



exports.approvedDeliveryProfile = async (req, res) => {
    try {
        console.log("req.body", req.body);

        var data = await UserModel.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(req.body.userId)
        }, {
            $set: {
                isDeliveryBoy: true,
            }
        }, {
            new: true
        })

        if (data) {
            res.status(200).send({
                message: "Profile Approved",
                response: data
            })
        } else {
            res.status(200).send({
                message: "No Data Found",
                response: []
            })
        }

    } catch (error) {
        res.status(200).send({
            message: "Error Occurred" + error,
            response: error
        })
    }
}

exports.approvedProfessionalProfile = async (req, res) => {
    try {
        var data = await UserModel.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(req.body.userId)
        }, {
            $set: {
                isProfessional: true,
            }
        }, {
            new: true
        })

        if (data) {
            res.status(200).send({
                message: "Profile Approved",
                response: data
            })
        } else {
            res.status(200).send({
                message: "No Data Found",
                response: []
            })
        }

    } catch (error) {
        res.status(200).send({
            message: "Error Occurred" + error,
            response: error
        })
    }
}

exports.addCategory = async(req, res) => {
    try{
        var {
            cat_name 
        } = req.body

        let categoryNameCheck = await categoryModel.findOne({ cat_name })
        if(categoryNameCheck){
            throw new Error("Already exist!!")
        }
        let addCategoryData = await categoryModel.insertMany({ cat_name })
        if(!addCategoryData) {
            throw new Error("Unable to insert category")
        }
        res.status(200).json({ 
            message : "Category added",
            response : addCategoryData
        })
    }catch(error){
        responses.sendError(error.message, res)
    }
}

exports.addSubcategory = async(req, res) => {
    try{
        var {
            _id,
            subcat_name
        } = req.body

        console.log(req.body)
        let addSubcategoryData = await subcategoryModel.insertMany({ cat_id : _id, subcat_name })
        if(!addSubcategoryData) {
            throw new Error("Unable to insert subcategory")
        }
        res.status(200).json({
            message : "Subcategory added",
            response : addSubcategoryData
        })
    } catch(error){
        responses.sendError(error.message, res)
    }
}

exports.getAllCategory = async (req, res) => {
    try {
        var data = await categoryModel.find()
        if (data) {
            res.status(200).send({
                message:"successful",
                response: data
            })
        } else {
            res.status(200).send({
                message:"No data found",
                response: []
            })
        }
    } catch (error) {
        console.log("**********Error Occured***********",error);
        
        res.status(200).send({
            message:"Error occured",
            response: [error]
        })
    }
}

exports.getSubCategoryByCatId = async (req, res) => {
    try {
        var data = await subcategoryModel.find({
            cat_id: mongoose.Types.ObjectId(req.body._id)
        })
        if (data) {
            res.status(200).send({
                message:"successful",
                response: data
            })
        } else {
            res.status(200).send({
                message:"No data found",
                response: []
            })
        }
    } catch (error) {
        console.log("**********Error Occured***********",error);
        
        res.status(200).send({
            message:"Error occured",
            response: [error]
        })
    }
}

exports.getAllSubCat = async (req, res) => {
    try {
        var data = await subcategoryModel.find().populate('cat_id')
        if (data) {
            res.status(200).send({
                message:"successful",
                response: data
            })
        } else {
            res.status(200).send({
                message:"No data found",
                response: []
            })
        }
    } catch (error) {
        console.log("**********Error Occured***********",error);
        
        res.status(200).send({
            message:"Error occured",
            response: [error]
        })
    }
}

exports.deleteCategory = async (req, res) => {
    try{
        var { _id } = req.body
        console.log(req.body)
        let deleteCategory = await categoryModel.remove({ _id })
        if(!deleteCategory) {
            throw new Error("Unable to delete category selected")
        }

        let deleteSubCategory = await subcategoryModel.remove({ cat_id : _id })
        if(!deleteSubCategory) {
            throw new Error("Unable to delete sub category selected")
        }

        res.status(200).json({
            message : "Category deleted successfully"
        })
    } catch(error) {
        responses.sendError(error.message, res)
    }
}

exports.deleteSubCategory = async (req, res) => {
    try {
        var { _id } = req.body
        
        let deleteSubCategoryData = await subcategoryModel.remove({ _id })
        if(!deleteSubCategoryData) {
            throw new Error("Unable to delete sub category selected")
        }

        res.status(200).json({
            message : "Subcategory deleted successfully",
            response : deleteSubCategoryData
        })
    } catch( error ) {
        responses.sendError(error.message, res)
    }
}

exports.editSubcategory = async (req, res) => {
    try {
        var {
            _id,
            subcat_name
        } = req.body

        let editSubCategory = await subcategoryModel.findByIdAndUpdate({ _id }, { subcat_name : subcat_name }, { new : true }) 
        if(!editSubCategory){
            throw new Error("Unable to edit ")
        }

        res.status(200).json({
            message : "Subcategory edited successfully",
            response : editSubCategory
        })
    } catch(error) {
        responses.sendError(error.message, res)
    }
}

exports.editCategory = async (req, res) => {
    try {
        var {
            _id,
            cat_name
        } = req.body

        let editCategoryData = await categoryModel.findByIdAndUpdate({ _id }, { cat_name : cat_name }, { new : true }) 
        if(!editCategoryData){
            throw new Error("Unable to edit ")
        }

        res.status(200).json({
            message : "Category edited successfully",
            response : editCategoryData
        })
    } catch(error) {
        responses.sendError(error.message, res)
    }
}

exports.deliveryNewOrder = async (req, res) => {

    try {
        var newServiceData = [];
        var arrServiceIds = [];


        var deliveryUserOffersData = await offersData.find({
            serviceGivenBy: {
               $ne: viewingPetId
            }
        })


        if (deliveryUserOffersData.length > 0) {
            deliveryUserOffersData.forEach(element => {
                arrServiceIds.push(element.serviceId);
            });

        }

        var where = {
            orderStatus: 1,
            _id: {
                $nin: arrServiceIds
            }
        }

        let newService = await serviceModel.find(where)
            .populate('serviceCreatedBy')
            .select('-pickup_location -drop_location');


        if (newService.length > 0) {
            res.status(200).send({
                message: 'List Of Near by orders',
                response: newService
            })
        } else {
            res.status(200).send({
                message: 'Sorry currently there are no orders available near by you...!',
                response: newService
            })
        }

    } catch (error) {
        responses.sendError(error.message, res)
    }
}

exports.deliveryPendingOrder = async (req, res) => {

    console.log("................" + req.body.long + ".........................." + req.body.lat);

    try {
        var newServiceData = [];
        var arrServiceIds = [];


        var deliveryUserOffersData = await offersData.find({
            serviceGivenBy: {
               $ne: viewingPetId
            }
        })

        if (deliveryUserOffersData.length > 0) {
            deliveryUserOffersData.forEach(element => {
                arrServiceIds.push(element.serviceId);
            });

        }

        let newService = await serviceModel.find({
                _id: {
                    $in: arrServiceIds
                }
            }).populate('serviceCreatedBy')
            .select('-pickup_location -drop_location');


        if (deliveryUserOffersData.length != 0 && newService.length != 0) {
            newService.forEach(service => {
                deliveryUserOffersData.forEach(offer => {
                    if (service._id.toString() == offer.serviceId.toString() && offer.serviceGivenBy.toString() == req.userId.toString()) {

                        newServiceData.push({
                            _id: service._id,
                            service_type: service.service_type,
                            orderId: service.orderId,
                            delivery_captains_50: service.delivery_captains_50,
                            delivery_captains_100: service.delivery_captains_100,
                            total_captains: service.total_captains,
                            orderStatus: service.orderStatus,
                            createdAt: service.createdAt,
                            pickup_address: service.pickup_address,
                            pickup_latitude: service.pickup_latitude,
                            pickup_longitude: service.pickup_longitude,
                            drop_address: service.drop_address,
                            drop_latitude: service.drop_latitude,
                            drop_longitude: service.drop_longitude,
                            comments: service.pickup_longitude,
                            serviceCreatedBy: service.serviceCreatedBy,
                            offerDetails: {
                                offerMessage: offer.deliveryMessage,
                                deliveryTime: offer.deliveryTime,
                                deliveryCharge: offer.deliveryCharge,
                                offerStatus: offer.offerStatus,
                                serviceGivenBy: offer.serviceGivenBy,
                                serviceId: offer.serviceId,
                            }



                        });
                    }
                });
            });
        } else {
            newServiceData = newService;

        }
        console.log("newServiceData", newServiceData);

        if (newServiceData.length > 0) {
            res.status(200).send({
                message: 'List Of Near by orders',
                response: newServiceData
            })
        } else {
            res.status(200).send({
                message: 'Sorry currently there are no orders available near by you...!',
                response: newServiceData
            })
        }

    } catch (error) {
        responses.sendError(error.message, res)
    }
}


exports.deliveryAcceptedOrders = async (req, res) => {

    try {
        let acceptedOrders = await serviceModel.aggregate([{
                $match: {
                    orderStatus: 2,
                    serviceGivenBy: {
                       $ne: viewingPetId
                    }

                }

            },
            {
                $lookup: {
                    from: "Offerbyusers",
                    localField: "_id",
                    foreignField: "serviceId",
                    as: "offerDetails"
                }
            },
            {
                $lookup: {
                    from: "userdeliveryprofile",
                    localField: "_id",
                    foreignField: "service_id",
                    as: "deliverydetails"
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "serviceCreatedBy",
                    foreignField: "_id",
                    as: "serviceCreatedBy"
                }
            },
            {
                "$unwind": {
                    "path": "$offerDetails",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$unwind": {
                    "path": "$deliverydetails",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$unwind": {
                    "path": "$serviceCreatedBy",
                    "preserveNullAndEmptyArrays": true
                }
            },
        ])


        if (acceptedOrders) {
            res.status(200).send({
                message: 'Get All list Of the eaccepted orders ',
                response: acceptedOrders
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}


exports.deliveryCompletedOrder = async (req, res) => {

    try {
        let acceptedOrders = await serviceModel.aggregate([{
                $match: {
                    orderStatus: 4,
                    serviceGivenBy: {
                       $ne: viewingPetId
                    }

                }

            },
            {
                $lookup: {
                    from: "Offerbyusers",
                    localField: "_id",
                    foreignField: "serviceId",
                    as: "offerDetails"
                }
            },
            {
                $lookup: {
                    from: "userdeliveryprofile",
                    localField: "_id",
                    foreignField: "service_id",
                    as: "deliverydetails"
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "serviceCreatedBy",
                    foreignField: "_id",
                    as: "serviceCreatedBy"
                }
            },
            {
                "$unwind": {
                    "path": "$offerDetails",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$unwind": {
                    "path": "$deliverydetails",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$unwind": {
                    "path": "$serviceCreatedBy",
                    "preserveNullAndEmptyArrays": true
                }
            },
        ])

        if (acceptedOrders) {
            res.status(200).send({
                message: 'Get All list Of the eaccepted orders ',
                response: acceptedOrders
            })
        }

    } catch (error) {
        responses.sendError(error.message, res)
    }
}

exports.professionalNewOrder = async (req, res) => {
    try {

        var newServiceData = [];
        var arrServiceIds = [];


        var deliveryUserOffersData = await offersData.find({
            serviceGivenBy: {
               $ne: viewingPetId
            }
        })


        if (deliveryUserOffersData.length > 0) {
            deliveryUserOffersData.forEach(element => {
                arrServiceIds.push(element.serviceId);
            });

        }

        var where = {
            orderStatus: 1,
            _id: {
                $nin: arrServiceIds
            }
        }

        let newService = await professionalModel.find(where)
            .populate('serviceCreatedBy')
            .select('-pickup_location -drop_location');


        if (newService.length > 0) {
            res.status(200).send({
                message: 'List Of Near by orders',
                response: newService
            })
        } else {
            res.status(200).send({
                message: 'Sorry currently there are no orders available near by you...!',
                response: newService
            })
        }

    } catch (error) {
        responses.sendError(error.message, res)
    }
}

exports.professionalpendingorders = async (req, res) => {

    console.log("................" + req.body.long + ".........................." + req.body.lat);

    try {
        var newServiceData = [];
        var arrServiceIds = [];


        var deliveryUserOffersData = await offersData.find()

        if (deliveryUserOffersData.length > 0) {
            deliveryUserOffersData.forEach(element => {
                arrServiceIds.push(element.serviceId);
            });

        }

        let newService = await professionalModel.find({
                _id: {
                    $in: arrServiceIds
                }
            }).populate('serviceCreatedBy')
            .select('-pickup_location -drop_location');


        if (deliveryUserOffersData.length != 0 && newService.length != 0) {
            newService.forEach(service => {
                deliveryUserOffersData.forEach(offer => {
                    if (service._id.toString() == offer.serviceId.toString() && offer.serviceGivenBy.toString() == req.userId.toString()) {

                        newServiceData.push({
                            _id: service._id,
                            service_type: service.service_type,
                            orderId: service.orderId,
                            delivery_captains_50: service.delivery_captains_50,
                            delivery_captains_100: service.delivery_captains_100,
                            total_captains: service.total_captains,
                            orderStatus: service.orderStatus,
                            createdAt: service.createdAt,
                            pickup_address: service.pickup_address,
                            pickup_latitude: service.pickup_latitude,
                            pickup_longitude: service.pickup_longitude,
                            comments: service.pickup_longitude,
                            serviceCreatedBy: service.serviceCreatedBy,
                            offerDetails: {
                                offerMessage: offer.deliveryMessage,
                                deliveryTime: offer.deliveryTime,
                                deliveryCharge: offer.deliveryCharge,
                                offerStatus: offer.offerStatus,
                                serviceGivenBy: offer.serviceGivenBy,
                                serviceId: offer.serviceId,
                            }



                        });
                    }
                });
            });
        } else {
            newServiceData = newService;

        }
        console.log("newServiceData", newServiceData);

        if (newServiceData.length > 0) {
            res.status(200).send({
                message: 'List Of Near by orders',
                response: newServiceData
            })
        } else {
            res.status(200).send({
                message: 'Sorry currently there are no orders available near by you...!',
                response: newServiceData
            })
        }

    } catch (error) {
        responses.sendError(error.message, res)
    }
}

exports.professionalAcceptedOrders = async (req, res) => {

    try {
        let acceptedOrders = await professionalModel.aggregate([{
                $match: {
                    orderStatus: 2,
                    serviceGivenBy:{
                       $ne: viewingPetId
                    }

                }

            },
            {
                $lookup: {
                    from: "Offerbyusers",
                    localField: "_id",
                    foreignField: "serviceId",
                    as: "offerDetails"
                }
            },
            {
                $lookup: {
                    from: "userdeliveryprofile",
                    localField: "_id",
                    foreignField: "service_id",
                    as: "deliverydetails"
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "serviceCreatedBy",
                    foreignField: "_id",
                    as: "serviceCreatedBy"
                }
            },
            {
                "$unwind": {
                    "path": "$offerDetails",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$unwind": {
                    "path": "$deliverydetails",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$unwind": {
                    "path": "$serviceCreatedBy",
                    "preserveNullAndEmptyArrays": true
                }
            },
        ])



        if (acceptedOrders) {
            res.status(200).send({
                message: 'Get All list Of the accepted orders ',
                response: acceptedOrders
            })
           
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}


exports.professionalCompletedOrder = async (req, res) => {

    try {

        let acceptedOrders = await professionalModel.aggregate([{
                $match: {
                    orderStatus: 4,
                    serviceGivenBy: {
                       $ne: viewingPetId
                    }

                }

            },
            {
                $lookup: {
                    from: "Offerbyusers",
                    localField: "_id",
                    foreignField: "serviceId",
                    as: "offerDetails"
                }
            },
            {
                $lookup: {
                    from: "userdeliveryprofile",
                    localField: "_id",
                    foreignField: "service_id",
                    as: "deliverydetails"
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "serviceCreatedBy",
                    foreignField: "_id",
                    as: "serviceCreatedBy"
                }
            },
            {
                "$unwind": {
                    "path": "$offerDetails",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$unwind": {
                    "path": "$deliverydetails",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$unwind": {
                    "path": "$serviceCreatedBy",
                    "preserveNullAndEmptyArrays": true
                }
            },
        ])

        if (acceptedOrders) {
            res.status(200).send({
                message: 'Get All list Of the completed orders ',
                response: acceptedOrders
            })
        }

    } catch (error) {
        responses.sendError(error.message, res)
    }
}


exports.getUserAcceptedOrder = async (req, res) => {

    try {
        console.log("reachedHere");
        console.log(req.body);

        var acceptedOrders = await serviceModel.aggregate([{
                $match: {
                    orderStatus: 2,
                    serviceCreatedBy:{
                       $ne: viewingPetId
                    }
                }

            },
            {
                $lookup: {
                    from: "Offerbyusers",
                    localField: "_id",
                    foreignField: "serviceId",
                    as: "offerDetails"
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "serviceGivenBy",
                    foreignField: "_id",
                    as: "serviceGivenBy"
                }
            },
            {
                "$unwind": {
                    "path": "$offerDetails",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$unwind": {
                    "path": "$serviceGivenBy",
                    "preserveNullAndEmptyArrays": true
                }
            },
        ])

        var acceptedService = await professionalModel.aggregate([{
                $match: {
                    orderStatus: 2,
                    serviceCreatedBy: {
                       $ne: viewingPetId
                    }
                }

            },
            {
                $lookup: {
                    from: "Offerbyusers",
                    localField: "_id",
                    foreignField: "serviceId",
                    as: "offerDetails"
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "serviceGivenBy",
                    foreignField: "_id",
                    as: "serviceGivenBy"
                }
            },
            {
                "$unwind": {
                    "path": "$offerDetails",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$unwind": {
                    "path": "$serviceGivenBy",
                    "preserveNullAndEmptyArrays": true
                }
            },
        ])

        var new_data = acceptedOrders.concat(acceptedService)
        if (new_data) {
            res.status(200).send({
                message: 'Get All list Of the eaccepted orders ',
                response: new_data
            })
        }

    } catch (error) {
        responses.sendError(error.message, res)
    }
}

exports.getUserPendingOrders = async (req, res) => {

    try {
        console.log("reachedHere");
        console.log(req.body);

        let acceptedOrders = await serviceModel.find({
            orderStatus: 1,
            serviceCreatedBy: {
               $ne: viewingPetId
            }

        }).select('-pickup_location -drop_location')

        let acceptedservice = await professionalModel.find({
            orderStatus: 1,
            serviceCreatedBy: {
               $ne: viewingPetId
            }
        }).select('-pickup_location');
        var new_data = acceptedOrders.concat(acceptedservice)

        if (new_data) {
            res.status(200).send({
                message: 'Get All list Of the eaccepted orders ',
                response: new_data
            })
        }

    } catch (error) {
        console.log(error);

        responses.sendError(error.message, res)
    }
}

exports.getUserCompletedOrder = async (req, res) => {

    try {
        console.log("reachedHere");
        console.log(req.body);

        let acceptedOrders = await serviceModel.find({
                orderStatus: 4,
                serviceCreatedBy: {
                   $ne: viewingPetId
                }

            })
            .populate('serviceGivenBy')
            .select('-pickup_location -drop_location')

        let acceptedservice = await professionalModel.find({
            orderStatus: 4,
            serviceCreatedBy: {
               $ne: viewingPetId
            }
        }).select('-pickup_location');
        var new_data = acceptedOrders.concat(acceptedservice)


        if (new_data) {
            res.status(200).send({
                message: 'Get All list Of the eaccepted orders ',
                response: new_data
            })
        }

    } catch (error) {
        responses.sendError(error.message, res)
    }
}

