var Joi = require('joi');
const mongoose = require('mongoose');
var async = require('async');
var responses = require('../../modules/responses');
const { locationModel } = require('../../models/savedlocationModel');

/**
 * Save Location of the user 
 */

exports.addNewUserLocation = async (req, res) => {
    try {
        console.log("reached here");
        
        const schema = Joi.object().keys({
            locationAdd: Joi.string().required().error(e => 'Address is required to save location'),
            userId: Joi.string().required().error(e => 'User id is required'),
            locationType: Joi.number().required().error(e => 'location type is not selected'),
            lat: Joi.string(),
            long: Joi.string(),
        })

        let newLocation = {
            locationAdd:req.body.locationAdd,
            userId: mongoose.Types.ObjectId(req.body.userId),
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
                msg:"location saved Successfully",
                data:addedLocation
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }

}

exports.getUserLocation = async (req, res) => {
    try {
        let listLocation = await locationModel.find({
            userId:mongoose.Types.ObjectId(req.param('userid'))
        });
        if(listLocation){
            res.status(200).send({
                msg:"List Of All Saved Location",
                data:listLocation
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }

}