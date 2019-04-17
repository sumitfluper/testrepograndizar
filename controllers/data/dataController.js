var Joi = require('joi');
const mongoose = require('mongoose');
var async = require('async');
var responses = require('../modules/responses');
var commonFunctions = require('../modules/commonFunction');
var status = require('../modules/status');
const locationModel = require('../../models/savedlocationModel');
var { UserModel } = require('../models/user.model');

/**
 * Save Location of the user 
 */

exports.addNewUserLocation = async (req, res) => {
    try {
        let newLocation = {
            locationAdd:req.body.locationAdd,
            userId: mongoose.Types.ObjectId(req.body.userId),
            location:{
                "type": "Point",
                "coordinates": [req.body.lat,req.body.long]
            },
        }
        
        let addedLocation = locationModel.create(newLocation);

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
        let listLocation = locationModel.find({
            userId:mongoose.Types.ObjectId(req.body.userId)
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