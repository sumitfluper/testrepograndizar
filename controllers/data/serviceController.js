const mongoose = require('mongoose');
const async = require('async');
const Joi = require('joi');
const config = require('../../services/config');
const responses = require('../../modules/responses');
const serviceModel = require('../../models/Service');
const categoryModel = require('../../models/Category');
const subCategoryModel = require('../../models/subcategories');
const professionalModel = require('../../models/Professional');
const offersData = require('../../models/Offerbyuser');
var googleApiHelper = require('../../helpers/googleApiHelper');
const uniqueRandom = require('unique-random');
const DeliverydetailsModel = require('../../models/Deliverydetails');
const FCM = require('../../modules/FCM');
const UserModel = require('../../models/User');
const commFunction = require('../../modules/commonFunction');
const invoiceModel = require('../../models/Invoce');




/*
  get New orders 
*/
exports.deliveryNewOrder = async (req, res) => {

    try {
        var newServiceData = [];
        var arrServiceIds = [];


        var deliveryUserOffersData = await offersData.find({
            serviceGivenBy: req.userId
        })


        if (deliveryUserOffersData.length > 0) {
            deliveryUserOffersData.forEach(element => {
                arrServiceIds.push(element.serviceId);
            });

        }

        var where = {
            pickup_location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [Number(req.body.long), Number(req.body.lat)]
                    },
                    $maxDistance: 5000,
                    $minDistance: 0,
                }
            },
            orderStatus: 1,
            serviceCreatedBy: {
                $ne: mongoose.Types.ObjectId(req.userId)
            },
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
            serviceGivenBy: req.userId
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
                    serviceGivenBy: req.userId

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
                    serviceGivenBy: req.userId

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
            serviceGivenBy: req.userId
        })


        if (deliveryUserOffersData.length > 0) {
            deliveryUserOffersData.forEach(element => {
                arrServiceIds.push(element.serviceId);
            });

        }

        var where = {
            pickup_location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [Number(req.body.long), Number(req.body.lat)]
                    },
                    $maxDistance: 5000,
                    $minDistance: 0,
                }
            },
            orderStatus: 1,
            serviceCreatedBy: {
                $ne: mongoose.Types.ObjectId(req.userId)
            },
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


        var deliveryUserOffersData = await offersData.find({
            serviceGivenBy: req.userId
        })

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
                    serviceGivenBy: req.userId

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
                    serviceGivenBy: req.userId

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
                    serviceCreatedBy: req.userId

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
                    serviceCreatedBy: req.userId

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
            serviceCreatedBy: req.userId

        }).select('-pickup_location -drop_location')

        let acceptedservice = await professionalModel.find({
            orderStatus: 1,
            serviceCreatedBy: req.userId

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
                serviceCreatedBy: req.userId

            })
            .populate('serviceGivenBy')
            .select('-pickup_location -drop_location')

        let acceptedservice = await professionalModel.find({
            orderStatus: 4,
            serviceCreatedBy: req.userId

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





// others 
exports.serviceRequire = async (req, res) => {
    try {
        const schema = Joi.object().keys({
            service_type: Joi.string().required(),
            pickup_address: Joi.string(),
            pickup_latitude: Joi.string(),
            pickup_longitude: Joi.string(),
            drop_address: Joi.string().optional(),
            drop_latitude: Joi.string().optional(),
            drop_longitude: Joi.string().optional(),
            start_time: Joi.string().required(),
            end_time: Joi.string().required(),
            comments: Joi.string().required(),
            service_name: Joi.string().optional(),
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

        var order = uniqueRandom(10000, 999999);

        console.log("console.log", orderId);


        let data = req.body;
        let serviceCreatedBy = req.userId;
        console.log(data.service_type)
        if (data.service_type === '1') {

            var orderId = "Delivery-" + order();
            var {
                service_type,
                pickup_address,
                pickup_longitude,
                pickup_latitude,
                drop_address,
                drop_longitude,
                drop_latitude,
                comments,
                start_time,
                end_time,
            } = req.body
            let pickup_location = {
                type: 'Point',
                coordinates: [Number(pickup_longitude), Number(pickup_latitude)]
            }
            let drop_location = {
                type: 'Point',
                coordinates: [Number(drop_longitude), Number(drop_latitude)]
            }
            let updateData = {
                service_type,
                orderId,
                pickup_address,
                pickup_latitude,
                pickup_longitude,
                drop_address,
                drop_latitude,
                drop_longitude,
                comments,
                pickup_location,
                drop_location,
                start_time,
                end_time,
                serviceCreatedBy
            }
            let user = new serviceModel(updateData)
            let userData = await user.save()
            if (userData) {
                res.status(200).json({
                    message: "Order submit successfully",
                    response: userData
                })
            } else {
                res.status(status.INVALID_CREDENTIAL).json({
                    message: "Unable to order, Try again after some time"
                })
            }
        } else if (data.service_type === '2') {

            var orderId = "Service-" + order();

            var {
                service_type,
                service_name,
                pickup_address,
                pickup_longitude,
                pickup_latitude,
                comments,
                start_time,
                end_time,
            } = req.body
            let pickup_location = {
                type: 'Point',
                coordinates: [Number(pickup_longitude), Number(pickup_latitude)]
            }
            let updateData = {
                service_type,
                orderId,
                service_name,
                pickup_address,
                pickup_latitude,
                pickup_longitude,
                pickup_location,
                comments,
                start_time,
                end_time,
                serviceCreatedBy
            }
            console.log(updateData)
            let user = new professionalModel(updateData)
            let userData = await user.save()
            if (userData) {
                res.status(200).json({
                    message: "Order submit successfully",
                    response: userData
                })
            } else {
                res.status(status.INVALID_CREDENTIAL).json({
                    message: "Unable to order, Try again after some time"
                })
            }

        } else {
            res.status(status.BAD_REQUEST).json({
                message: "Try again"
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}

// createServiceNow
exports.cancelServiceByUser = async (req, res) => {
    try {
        let cancelService = await serviceModel.findByIdAndUpdate(req.body.serviceId, {
            $set: {
                orderStatus: 3,
                reasion: req.body.cancellationReason,
                cancelComments: req.body.cancelComments,
                cancelledBy: req.userId
            }
        }, {
            new: true
        })
        if (cancelService) {
            res.status(200).send({
                message: "Service is cancelled successfully",
                response: cancelService
            })
        }
    } catch (error) {
        console.error(`**********************${error}**********************`);
        res.status(200).send({
            message: "Ooops........! Error occured Please try again",
            response: error
        })

    }
}

exports.getNearbyOutlets = async (req, res) => {
    try {
        var {
            pickup_address,
            pickup_latitude,
            pickup_longitude
        } = req.body

        let userData = await serviceModel.find({
            pickup_location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [pickup_longitude, pickup_latitude]
                    },
                    $maxDistance: 50000
                }
            }
        })
        if (userData) {
            var data = [{
                    "outlet": "McDonald",
                    "Address": "saudi-11021",
                    "Phone_number": "7894561230"
                },
                {
                    "outlet": "McDonald",
                    "Address": "saudi-11021",
                    "Phone_number": "7894524530"
                },
                {
                    "outlet": "McDonald",
                    "Address": "saudi arabia-1105021",
                    "Phone_number": "125856430"
                }
            ]
            res.status(200).json({
                response: data
            })
        } else {
            res.status(status.NOT_FOUND).json({
                message: "Data not found!"
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}

exports.activeCaptains = async (req, res) => {
    try {
        var {
            pickup_latitude,
            pickup_longitude
        } = req.body

        //delivery captains in the range of 50 kms
        let userData = await serviceModel.find({
            pickup_location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [pickup_longitude, pickup_latitude],
                        $maxDistance: 50000
                    }
                }
            }
        })
        if (userData.length === 0) {
            res.send('0')
        } else {
            let delivery_captains_50 = userData.length;
            let updateData = {
                delivery_captains_50
            }

            let user = new serviceModel(updateData)
            let userResult = await user.save()
            res.json({
                response: userResult
            })
        }

        //delivery captains in the range of 100 kms
        let data = await serviceModel.find({
            pickup_location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [pickup_longitude, pickup_latitude],
                        $maxDistance: 100000
                    }
                }
            }
        })
        if (data.length === 0) {
            res.json({
                response: "0"
            })
        } else {
            let delivery_captains_100 = data.length;
            let updateData = {
                delivery_captains_100
            }

            let user = new serviceModel(updateData)
            let userResult = await user.save()
            res.json({
                response: userResult
            })
        }

        //total delivery captains
        let data1 = await serviceModel.find({
            pickup_location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [pickup_longitude, pickup_latitude],
                    }
                }
            }
        })
        if (data1.length === 0) {
            res.json({
                response: "0"
            })
        } else {
            let total_captains = data1.length;
            let updateData = {
                total_captains
            }

            let user = await new serviceModel(updateData)
            let userResult = user.save()
            res.json({
                response: userResult
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}


exports.getCategoryList = async (req, res) => {
    try {
        let categoryList = await categoryModel.find()
        res.status(200).json({
            response: categoryList
        })
    } catch (error) {
        responses.sendError(error.message, res)
    }
}


exports.getSubCategoryList = async (req, res) => {
    try {
        console.log("sub cat list")
        var {
            cat_id
        } = req.query
        console.log(req.query)
        let subCategoryList = await subCategoryModel.find({
            cat_id
        })
        if (subCategoryList) {
            res.status(200).json({
                response: subCategoryList
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


exports.getNewServices = async (req, res) => {
    try {
        let newServices = await serviceModel.find({
            is_accepted: false,
            is_canclled: false,
            is_completed: false
        }).sort({
            createdAt: -1
        })
        if (!newServices) {
            res.status(200).send({
                message: "No New Services Available"
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}


exports.acceptService = async (req, res) => {
    try {
        var isService = await serviceModel.findById(req.body.serviceId)

        if (isService) {

            var updateService = await serviceModel.findByIdAndUpdate({
                _id: req.body.serviceId
            }, {
                $set: {
                    orderStatus: 2,
                    serviceGivenBy: mongoose.Types.ObjectId(req.body.serviceGivenBy),
                }
            }, {
                new: true
            })

            commFunction.createFirebaseDeliveryNode(req.body.serviceId)

        } else {
            var updateService = await professionalModel.findByIdAndUpdate({
                _id: req.body.serviceId
            }, {
                $set: {
                    orderStatus: 2,
                    serviceGivenBy: mongoose.Types.ObjectId(req.body.serviceGivenBy),
                }
            }, {
                new: true
            })
            commFunction.createFirebaseDeliveryNode(req.body.serviceId)
        }

        await offersData.findOneAndUpdate({
            serviceId: mongoose.Types.ObjectId(req.body.serviceId),
            serviceGivenBy: mongoose.Types.ObjectId(req.body.serviceGivenBy),
        }, {
            $set: {
                offerStatus: 2
            }
        }, {
            new: true
        });
        if (updateService.drop_longitude != '' && updateService.drop_latitude != '') {
            var deliverydetails = {
                delivery_status: "Not Started",
                service_id: updateService._id,
                pickup_address: updateService.pickup_address,
                pickup_latitude: updateService.pickup_latitude,
                pickup_longitude: updateService.pickup_longitude,
                drop_address: updateService.drop_address,
                drop_latitude: updateService.drop_latitude,
                drop_longitude: updateService.drop_longitude,
            }
        } else {
            var deliverydetails = {
                delivery_status: "Not Started",
                service_id: updateService._id,
                pickup_address: updateService.pickup_address,
                pickup_latitude: updateService.pickup_latitude,
                pickup_longitude: updateService.pickup_longitude,
            }
        }


        await DeliverydetailsModel.create(deliverydetails);

        if (updateService) {
            res.status(200).send({
                message: "Offer Accepted",
                response: updateService
            })
        } else {
            res.status(200).send({
                message: "offer can not be updated please try again later ....!"
            })
        }
    } catch (error) {
        console.log(error);

        responses.sendError(error.message, res)
    }
}


exports.updateServiceStatus = async (req, res) => {
    try {

        let isService = await serviceModel.findById(req.body.serviceId)
        if (isService) {
            var Data = await serviceModel.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(req.body.serviceId)
            }, {
                $set: {
                    delivery_status: req.body.delivery_status
                }
            }, {
                new: true
            })
        } else {
            var Data = await professionalModel.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(req.body.serviceId)
            }, {
                $set: {
                    delivery_status: req.body.delivery_status
                }
            }, {
                new: true
            })
        }
        if (Data) {
            res.status(200).send({
                message: "updated successfully",
                response: Data
            })
        } else {
            res.status(200).send({
                message: "Unable to update status",
                response: Data
            })
        }
    } catch (error) {
        res.status(200).send({
            message: "error occurred",
            response: error
        })
    }
}

exports.workDone = async (req, res) => {
    try {

        let isService = await serviceModel.findById(req.body.serviceId)

        if (isService) {
            if (isService.delivery_status == '4') {
                var Data = await serviceModel.findOneAndUpdate({
                    _id: mongoose.Types.ObjectId(req.body.serviceId)
                }, {
                    $set: {
                        orderStatus: req.body.orderStatus
                    }
                }, {
                    new: true
                })
            } else {
                res.status(200).send({
                    message: "you have not completed the task please complete",
                    response: []
                })
            }

        } else {
            let isService = await professionalModel.findById(req.body.serviceId)
            if (isService.delivery_status == '4') {
                var Data = await professionalModel.findOneAndUpdate({
                    _id: mongoose.Types.ObjectId(req.body.serviceId)
                }, {
                    $set: {
                        orderStatus: req.body.orderStatus
                    }
                }, {
                    new: true
                })
            } else {
                res.status(200).send({
                    message: "you have not completed the task please complete",
                    response: []
                })
            }

        }
        if (Data) {
            res.status(200).send({
                message: "updated successfully",
                response: Data
            })
        } else {
            res.status(200).send({
                message: "Unable to update status",
                response: Data
            })
        }
    } catch (error) {
        res.status(200).send({
            message: "error occurred",
            response: error
        })
    }
}


exports.uploadImageonchat = async (req, res) => {
    try {
        var documentsData = req.files;
        return res.status(200).send({
            message: "send successfully",
            response: 'chatimage/' + documentsData[0].filename
        })
    } catch (error) {
        return res.status(200).send({
            message: "error occured",
            response: error
        })
    }
}

exports.sendChatNotification = async (req, res) => {
    try {
        const serverKey = 'AAAAGsVckmo:APA91bEAtxMaIVSPcA_Y6BYKtkQVLCyFt7n1qhN1H39Ysv7hGrNShzPT1b585NnSDrf_X21RnOPQj-XTP-DtJ4vbGKAWEJY8lvjLbNFoTQIMebqejAhgq4m4zQQtOxSc3hc_BjMvtMUp'
        let payload = {
            _id: req.body._id,
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            message: req.body.message,
            data_type: req.body.data_type,
            is_first: req.body.is_first,
        }

        console.log("payload",payload);
        
        let userData = await UserModel.findById(mongoose.Types.ObjectId(req.body.receiver_id))
        let token = userData.device_token;
        let device_type = userData.device_type

        FCM.push_notification(serverKey, token = "", device_type, payload, notify, callback)

    } catch (error) {
        return res.status(200).send({
            message: "error occured",
            response: error
        })
    }
}

exports.createInvoice = async (req, res)=> {
    try {
        let data = {
            serviceId: req.body.serviceId,
            generatedBy: req.userId,
            generatedto: req.body.generatedto,
            deliveryCharge:req.body.deliveryCharge,
            taxAmount: req.body.deliveryCharge * 5 / 100 ,
            goodsCharge: req.body.goodsCharge,
        }
        if(req.files){
            data.billImage = 'invoice/' + req.files[0].filename
        } else {
            res.status(422).send({
                message:"Invoce image is missing",
                response:[]
            })
        }
        data.totalAmount = Number(data.taxAmount) + Number(data.deliveryCharge) + Number(data.goodsCharge); 
        var newData = await invoiceModel.create(data); 
        if(newData){
            res.status(200).send({
                message: "Invoce generated successfully",
                response: newData
            })
        } else {
            res.status(200).send({
                message: "Error while creating invoice",
                response: newData
            })
        }
    } catch (error) {
        res.status(400).send({
            message: "Error Occurred",
            response: error
        })        
    }
}
exports.getUserWalletDetails = async (req, res) => {
    try {

        var totalOrders = await serviceModel.aggregate([{
                $match: {
                    serviceCreatedBy: mongoose.Types.ObjectId(req.userId),
                    orderStatus: 4,

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
                "$unwind": {
                    "path": "$offerDetails",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $project: {
                    offerDetails: 1,
                    
                }
            }
        ])

        console.log("totalOrders.length",totalOrders.length);
        
        res.status(200).send({
            message: "success",
            response: totalOrders
        })





    } catch (error) {
        res.status(400).send({
            message: "Error Occurred",
            response: error
        })
    }
}