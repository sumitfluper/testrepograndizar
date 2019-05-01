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
        
        OffersList = await offerModel.find({
            serviceId:req.body.srerviceId,
        })
        
        if (OffersList) {
            return res.status(200).send({
                message:"OffersList ",
                response: OffersList
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

