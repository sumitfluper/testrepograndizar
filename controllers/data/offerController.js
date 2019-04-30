const mongoose = require('mongoose');
const async = require('async');
const responses = require('../../modules/responses');
const offerModel = require('../../models/Offerbyuser');


exports.makeAnOffer = async (req, res) => {
    try {
        let data = {
            serviceId:req.body.srerviceId,
            serviceCreatedBy: req.body.srerviceCreatedBy,
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


exports.acceptOffer = async (req, res) => {
    try {
        
        let data = {
            serviceId:req.body.rerviceId,
            serviceGivenBy: req.userId,
        };
        let offer = await offerModel.findOneAndUpdate(data, {
            $set: {
                offerStatus: 2
            }
        }, {
            new: true
        });
        if(offer){
            let rejectOtherOffer = await offerModel.updateMany({
                serviceId: {
                    $ne: req.body.rerviceId
                },
                serviceGivenBy: {
                    $ne: req.body.offerMadeBy
                }
            }, {
                $set: {
                    offerStatus: 3
                }
            }, {
                new: true
            });

            if(rejectOtherOffer){
                res.status(200).send({
                    message: "Offer accepted Successfully",
                    response: offer,
                })
            }

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
