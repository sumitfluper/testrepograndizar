var Joi = require('joi');
const mongoose = require('mongoose');
var async = require('async');
var responses = require('../../modules/responses');
const locationModel = require('../../models/Savedlocation');

/**
 * Save Location of the user 
 */

exports.addNewUserLocation = async (req, res) => {
    try {
        console.log("reached here");
        
        const schema = Joi.object().keys({
            locationAdd: Joi.string().required().error(e => 'Address is required to save location'),
            locationType: Joi.number().required().error(e => 'location type is not selected'),
            lat: Joi.string(),
            long: Joi.string(),
        })
        console.log("req.userId",req.userId);
        

        let newLocation = {
            locationAdd:req.body.locationAdd,
            userId:req.userId,
            locationType: req.body.locationType,
            location:{
                "type": "Point",
                "coordinates": [req.body.long,req.body.lat]
            },
        }

        let data = new locationModel(newLocation);
        
        let addedLocation = await data.save();

        if(addedLocation){
            res.status(200).send({
                message:"location saved Successfully",
                response:addedLocation
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }

}

exports.getUserLocation = async (req, res) => {
    try {
        let listLocation = await locationModel.find({
            userId:mongoose.Types.ObjectId(req.userId)
        });
        await listLocation.forEach(element => {
            if(element.locationType == 1){
                element.locationType = "Home";
            } else {
                element.locationType = "office";
            } 
        });
        if(listLocation){
            res.status(200).send({
                message:"List Of All Saved Location",
                response:listLocation
            })

        }

       
    } catch (error) {
        responses.sendError(error.message, res)
    }

}