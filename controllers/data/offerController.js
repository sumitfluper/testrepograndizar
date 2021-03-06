const mongoose = require('mongoose');
const async = require('async');
const responses = require('../../modules/responses');
const offerModel = require('../../models/Offerbyuser');
const serviceModel = require('../../models/Service');



exports.makeAnOffer = async (req, res) => {
    try {
        let data = {
            serviceId:req.body.serviceId,
            serviceCreatedBy: req.body.serviceCreatedBy,
            serviceGivenBy: req.userId,
            deliveryCharge:req.body.deliveryCharge,
            deliveryMessage:req.body.deliveryMessage,
            deliveryTime:req.body.deliveryTime,
        }

        checkifexisist = await offerModel.find({
            serviceGivenBy: req.body.offerMadeBy,
            serviceId:req.body.rerviceId,
        })
        if(checkifexisist > 0){
            return res.status(200).send({
                msg: "sorry.....! you already have made an offer"
            })
        }

        offerMade = await offerModel.create(data);
        if (offerMade) {
            return res.status(200).send({
                message:"offer made successfully",
                response: offerMade
            })
        } 
    } catch (error) {

        console.log(`\****************\ \n ${error} \n \**************** `);
        return res.status(200).send({
            message: "Ooops ! Something went wrong please check with backend"
        })        
    }
}

exports.getOfferList = async (req, res) => {
    try {

        offerList = await offerModel.find({
            serviceGivenBy: req.userId,
            offerStatus: 1
        });

        if (offerMade) {
            return res.status(200).send({
                message: "offer List",
                response: offerList
            })
        }
    } catch (error) {

        console.log(`\****************\ \n ${error} \n \**************** `);
        return res.status(200).send({
            message: "Ooops ! Something went wrong please check with backend"
        })
    }
}

exports.getAllOffers = async (req, res) => {
    try {
        console.log(req.body);
        var arrOffers = [];
        
        var isdeliveryService = await serviceModel.findById(req.body.serviceId); 
        if (isdeliveryService) {
           var OffersList = await offerModel.find({
                    serviceId: mongoose.Types.ObjectId(req.body.serviceId),
                })
                .populate('serviceId')
                .populate('serviceGivenBy')
        } else {
            var OffersList = await offerModel.aggregate([
                {
                    $match: {
                        serviceId: mongoose.Types.ObjectId(req.body.serviceId),
                    }
    
                }, 
                {
                    $lookup: {
                        from: "Professional",
                        localField: "serviceId",
                        foreignField: "_id",
                        as: "serviceId"
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
                { "$unwind": { "path": "$serviceId", "preserveNullAndEmptyArrays": true } },
                { "$unwind": { "path": "$serviceGivenBy", "preserveNullAndEmptyArrays": true } },
            ])
        }

        OffersList.forEach(element => {
            console.log("offers",element);
            
           arrOffers.push({
               offerId:element._id,
               offerStatus:element.offerStatus,
               createdAt:element.createdAt,
               serviceCreatedBy:element.serviceCreatedBy,
               deliveryCharge:element.deliveryCharge,
               deliveryMessage:element.deliveryMessage,
               deliveryTime:element.deliveryTime,
               serviceId:element.serviceId._id,
               pickup_lat:element.serviceId.pickup_latitude,
               pickup_long:element.serviceId.pickup_longitude,
               drop_lat:element.serviceId.drop_latitude,
               drop_long:element.serviceId.drop_longitude,
               deliveryBoyLat:element.serviceGivenBy.longitude,
               deliveryBoyLong:element.serviceGivenBy.latitude,
               deliveryName:element.serviceGivenBy.user_name ? element.serviceGivenBy.user_name : "N/A",
               serviceGivenBy:element.serviceGivenBy._id,
               serviceGivenByProfilePic: element.serviceGivenBy.profile_image,

           }) 
        });
        
        if (arrOffers.length > 0) {
            return res.status(200).send({
                message:"list off offers ",
                response: arrOffers
            })
        } else {
            return res.status(200).send({
                message: "No offers has been made to your request. Sorry......!",
                response: arrOffers

            })
        }  
    } catch (error) {

        console.log(`\****************\ \n ${error} \n \**************** `);
        return res.status(200).send({
            message: "Ooops ! Something went wrong please check with backend"
        })        
    }
}

// not working anywhere 
exports.acceptOffer = async (req, res) => {
    try {
        console.log("reached here");
       
        let offer = await offerModel.findOneAndUpdate({
            serviceId: mongoose.Types.ObjectId(req.body.serviceId),
            serviceGivenBy: mongoose.Types.ObjectId(req.body.serviceGivenBy),
        }, {
            $set: {
                offerStatus: 2
            }
        },{
            new:true
        });

        if(offer){
           await serviceModel.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(req.body.serviceId),
            },{
                $set:{
                    serviceGivenBy: mongoose.Types.ObjectId(req.body.offerMadeBy)
                    
                }
            }
            ,{
                new: true
            }          
            )



            res.status(200).send({
                message: "Offer accepted Successfully",
                response: offer,
            })

        } else {
            res.status(200).send({
                message: "There is some error in accepting. Please contact support"
            });
        }

    } catch (error) {

        console.log(`\****************\ \n ${error} \n \**************** `);
        res.status(200).send({
            message: "Ooops ! Something went wrong please check with backend"
        })        
    }
}

