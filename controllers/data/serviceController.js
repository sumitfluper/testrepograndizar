const mongoose = require('mongoose');
const async = require('async');
const responses = require('../../modules/responses');
const { serviceModel } = require('../../models/services');



/*
    get New orders 
*/
exports.getAllNewOrder = async (req,res) => {

    try {
        console.log("reachedHere");
        console.log(req.body);
        
        var where = {
            pickup_location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            req.body.lat,
                            req.body.long
                        ]
                    },
                    $maxDistance: 5000,
                    $minDistance: 0,
                }
            },
            orderStatus:1
        }

        let newOrders =  await serviceModel.find(where);
        if(newOrders){
            res.status(200).send({
                msg:'List Of Near by orders',
                data:newOrders 
            })
        }
        
    } catch (error) {
        responses.sendError(error.message, res)
    }
}

    
    exports.getAllAcceptedOrder = async (req,res) => {

        try {
            console.log("reachedHere");
            console.log(req.body);
            
            let acceptedOrders =  await serviceModel.find({
                orderStatus:1,

            });
            if(acceptedOrders){
                res.status(200).send({
                    msg:'Get All list Of the eaccepted orders ',
                    data:acceptedOrders 
                })
            }
            
        } catch (error) {
            responses.sendError(error.message, res)
        }
    }
