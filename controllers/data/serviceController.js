const mongoose = require('mongoose');
const async = require('async');
const Joi = require('joi');
const responses = require('../../modules/responses');
const serviceModel = require('../../models/Service');



/*
    get New orders 
*/
exports.deliveryNewOrder = async (req, res) => {

    try {
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
          orderStatus: 1
      }
     
      let newOrders = await serviceModel.find(where).select('-pickup_location -drop_location');
      if (newOrders) {
          res.status(200).send({
              message: 'List Of Near by orders',
              response: newOrders
          })
      }

    } catch (error) {
        responses.sendError(error.message, res)
    }
}

exports.deliveryAcceptedOrders = async (req, res) => {

    try {
        let acceptedOrders = await serviceModel.find({
            orderStatus: 2,
            serviceCreatedBy: req.userId

        }).populate('serviceGivenBy');
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

        let acceptedOrders = await serviceModel.find({
            orderStatus: 4,
            serviceGivenBy: req.userId

        }).populate('serviceCreatedBy');
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
        console.log("reachedHere");
        console.log(req.body);

        var where = {
            pickup_location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            req.body.long,
                            req.body.lat
                        ]
                    },
                    $maxDistance: 5000,
                    $minDistance: 0,
                }
            },
            orderStatus: 1
        }

        let newOrders = await serviceModel.find(where);
        if (newOrders) {
            res.status(200).send({
                message: 'List Of Near by orders',
                response: newOrders
            })
        }

    } catch (error) {
        responses.sendError(error.message, res)
    }
}

exports.professionalAcceptedOrders = async (req, res) => {

    try {
        let acceptedOrders = await serviceModel.find({
            orderStatus: 2,
            serviceCreatedBy: req.userId

        }).populate('serviceGivenBy');
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


exports.professionalCompletedOrder = async (req, res) => {

    try {

        let acceptedOrders = await serviceModel.find({
            orderStatus: 4,
            serviceGivenBy: req.userId

        }).populate('serviceCreatedBy');
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


exports.getUserAcceptedOrder = async (req, res) => {

    try {
        console.log("reachedHere");
        console.log(req.body);

        let acceptedOrders = await serviceModel.find({
            orderStatus: 1,
            serviceGivenBy: req.body.userId

        }).populate('serviceCreatedBy');
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

exports.getUserPendingOrders = async (req, res) => {

    try {
        console.log("reachedHere");
        console.log(req.body);

        let acceptedOrders = await serviceModel.find({
            orderStatus: 1,
            serviceCreatedBy: req.body.userId

        }).populate('serviceGivenBy');
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

exports.getUserCompletedOrder = async (req, res) => {

    try {
        console.log("reachedHere");
        console.log(req.body);

        let acceptedOrders = await serviceModel.find({
            orderStatus: 1,
            serviceCreatedBy: req.body.userId

        }).populate('serviceGivenBy');
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
            orderDetails: Joi.string().required()    
            
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

        //var { service_type, pickup_address, pickup_latitude, pickup_longitude, drop_address, drop_latitude, drop_longitude, comments, start_time, end_time} = req.body
        //let allData = req.body
        //let access_token = req.user.access_token;

        let data = req.body;
        let serviceCreatedBy = req.userId;
        console.log(data.service_type)
        if (data.service_type === '1') {
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
                orderDetails
            } = req.body
            let pickup_location = {
                type: 'Point',
                "coordinates": [pickup_longitude, pickup_latitude]
            }
            let drop_location = {
                type: 'Point',
                "coordinates": [drop_longitude, drop_latitude]
            }
            let updateData = {
                service_type,
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
                orderDetails,
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
            var {
                service_type,
                service_name,
                pickup_address,
                pickup_longitude,
                pickup_latitude,
                comments,
                start_time,
                end_time,
                orderDetails
            } = req.body
            let pickup_location = {
                type: 'Point',
                "coordinates": [pickup_longitude, pickup_latitude]
            }
            let updateData = {
                service_type,
                service_name,
                pickup_address,
                pickup_latitude,
                pickup_longitude,
                pickup_location,
                comments,
                start_time,
                end_time,
                orderDetails,
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