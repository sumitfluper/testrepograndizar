var Joi = require('joi');
const mongoose = require('mongoose');
var async = require('async');
var responses = require('../../modules/responses');
const locationModel = require('../../models/Savedlocation');
const IndustryModel = require('../../models/Industries');

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
       var newLocationData = [];
        let listLocation = await locationModel.find({
            userId:mongoose.Types.ObjectId(req.userId)
        });
        await listLocation.forEach(element => {
            newLocationData.push({
                location: element.location,
                locationType:element.locationType,
                _id: element._id,
                locationAdd: element.locationAdd,
                userId: element.userId,
                createdAt: element.createdAt,
                lat: element.location.coordinates[1],
                long: element.location.coordinates[0]
            });
            
        });
        console.log("newLocationData",newLocationData);

        if(listLocation){
            res.status(200).send({
                message:"List Of All Saved Location",
                response:newLocationData
            })

        }

       
    } catch (error) {
        responses.sendError(error.message, res)
    }

}

exports.industry = async (req, res) => {
    try {
        if(req.method == "POST"){

            let newIndustry = await IndustryModel.create(req.body);
            if(newIndustry){
                req.status(200).response({
                    message: "Created Successfully",
                    response: newIndustry
                })
            } else {
                req.status(200).response({
                    message: "unable to create industry",
                    response:[]
                })
            }
        }
        if(req.method == "PUT"){
            let updateData = req.body;
            let industry_id = req.param.industry_id;
            let newIndustry = await IndustryModel.findByIdAndUpdate(req.userId,{
                $set: {updateData}
            },{
                new: true
            });
            if(newIndustry){
                req.status(200).response({
                    message: "updated Successfully",
                    response: newIndustry
                })
            } else {
                req.status(200).response({
                    message: "unable to update industry",
                    response:[]
                })
            }
        }
        if(req.method == "GET"){
            let industryList = await IndustryModel.find();
            if(industryList){
                res.status(200).send({
                    message: "List of Industry",
                    response: industryList
                })
            } else {
                res.status(200).send({
                    message: "Unable to fetch data Please try again"
                })
            }
            
        }
        if(req.method == "DELETE"){
    
        }
    } catch (error) {
        console.log("*****************",error,"***********************");
        req.status(200).response({
            message: "unable to create industry",
            response:[]
        })
    }
}