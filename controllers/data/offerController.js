const mongoose = require('mongoose');
const async = require('async');
const responses = require('../../modules/responses');
const offerModel = require('../../models/Offerbyuser');


exports.makeAnOffer = async (req, res) => {
    try {
        let data = {
            serviceId:req.body.srerviceId,
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
        var arrOffers = [];
        
        var OffersList = await offerModel.find({
            serviceId:req.body.srerviceId,
        })
        .populate('serviceId')
        .populate('serviceGivenBy')
        .select(`
                -serviceId.pickup_location 
                -serviceId.drop_location 
                -serviceId.service_type
                -serviceId.delivery_captains_50
                -serviceId.delivery_captains_100
                -serviceId.total_captains
                -serviceId.orderStatus
                -serviceId.reasion
                -serviceId.cancelComments
                -serviceId._id
                -serviceId.pickup_address
                -serviceId-drop_address

            -serviceCreatedBy
        `
        )

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
               serviceId:element.srerviceId._id,
               pickup_lat:element.srerviceId.pickup_latitude,
               pickup_long:element.srerviceId.pickup_longitude,
               drop_lat:element.srerviceId.drop_latitude,
               drop_long:element.srerviceId.drop_longitude,
               deliveryBoyLat:element.serviceGivenBy.longitude,
               deliveryBoyLong:element.serviceGivenBy.latitude,
               deliveryName:element.serviceGivenBy.user_name ? element.serviceGivenBy.user_name : element.serviceGivenBy.name,
               deliveryId:element.serviceGivenBy._id,

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


exports.acceptOffer = async (req, res) => {
    try {
        console.log("reached here");
        

        // let offerStatus={$set:2};
        // let _id= req.body.offerId;
        // let offer = await offerModel.findByIdAndUpdate(_id,offerStatus);
        // // responses.success(res,'Successfully updated the user',user)






        
        let offer = await offerModel.findOneAndUpdate({
            serviceId: mongoose.Types.ObjectId(req.body.serviceId),
            serviceGivenBy: req.userId,
        }, {
            $set: {
                offerStatus: 2
            }
        });
        if(offer){
            // let rejectOtherOffer = await offerModel.updateMany({
            //     serviceId: {
            //         $ne: req.body.serviceId
            //     },
            //     serviceGivenBy: {
            //         $ne: req.body.offerMadeBy
            //     }
            // }, {
            //     $set: {
            //         offerStatus: 3
            //     }
            // }, {
            //     new: true
            // });

            // if(rejectOtherOffer){
               
            // }

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

