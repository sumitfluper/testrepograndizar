var Joi = require('joi');
const mongoose = require('mongoose');
var async = require('async');
var responses = require('../../modules/responses');
const locationModel = require('../../models/Savedlocation');
const IndustryModel = require('../../models/Industries');
const SectionModel = require('../../models/Section');
const VehicletypeModel = require('../../models/Vehicletype');
const licenseTypeModel = require('../../models/Licensetype');
const GovermentIdModel = require('../../models/Govermentid');
const professions = require('../../models/Professions');

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
            locationName: req.body.locationName ? req.body.locationName : "N/A",
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
                locationName:element.locationName,
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
            console.log(req.body);
            
            let newIndustry = await IndustryModel.create(req.body);
            if(newIndustry){
                res.status(200).send({
                    message: "Created Successfully",
                    response: newIndustry
                })
            } else {
                res.status(200).send({
                    message: "unable to create industry",
                    response:[]
                })
            }
        }
        if(req.method == "PUT"){
            let updateData = req.body;
            let _id = mongoose.Types.ObjectId(req.params._id) ;
            let newIndustry = await IndustryModel.findByIdAndUpdate(_id,{
                $set: updateData
            },{
                new: true
            });
            if(newIndustry){
                res.status(200).send({
                    message: "updated Successfully",
                    response: newIndustry
                })
            } else {
                res.status(200).send({
                    message: "unable to update industry",
                    response:[]
                })
            }
        }
        if(req.method == "GET"){
            console.log(req.userId);
            
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
            let industryList = await IndustryModel.remove({
                _id: mongoose.Types.ObjectId(req.params._id)
            });
            if(industryList){
                res.status(200).send({
                    message: "Deleted Successfully",
                    response: industryList
                })
            } else {
                res.status(200).send({
                    message: "unable to delete the industry"
                })
            }

        }
    } catch (error) {
        console.log("*****************",error,"***********************");
        res.status(200).send({
            message: "some error occurred",
            response:[]
        })
    }
}

exports.section = async (req, res) => {
    try {
        if(req.method == "POST"){

            let newSection = await SectionModel.create(req.body);
            if(newSection){
                res.status(200).send({
                    message: "Created Successfully",
                    response: newSection
                })
            } else {
                res.status(200).send({
                    message: "unable to create Section",
                    response:[]
                })
            }
        }
        if(req.method == "PUT"){
            let updateData = req.body;
            let _id = mongoose.Types.ObjectId(req.params._id);
            let newSection = await SectionModel.findByIdAndUpdate(_id,{
                $set: updateData
            },{
                new: true
            });
            if(newSection){
                res.status(200).send({
                    message: "updated Successfully",
                    response: newSection
                })
            } else {
                res.status(200).send({
                    message: "unable to update Section",
                    response:[]
                })
            }
        }
        if(req.method == "GET"){
            let sectionList = await SectionModel.find();
            if(sectionList){
                res.status(200).send({
                    message: "List of Section",
                    response: sectionList
                })
            } else {
                res.status(200).send({
                    message: "Unable to fetch data Please try again"
                })
            }
            
        }
        if(req.method == "DELETE"){
            let sectionList = await SectionModel.remove({
                _id: mongoose.Types.ObjectId(req.params._id)
            });
            if(industryList){
                res.status(200).send({
                    message: "Deleted Successfully",
                    response: industryList
                })
            } else {
                res.status(200).send({
                    message: "unable to delete the industry"
                })
            }

        }
    } catch (error) {
        console.log("*****************",error,"***********************");
        res.status(200).send({
            message: "some error occurred",
            response:[]
        })
    }
}

exports.getAllSections = async (req, res) => {
    try {
        let sectionList = await SectionModel.find().populate('');
        if(sectionList){
            res.status(200).send({
                message: "List of Section",
                response: sectionList
            })
        } else {
            res.status(200).send({
                message: "Unable to fetch data Please try again"
            })
        }
    } catch (error) {
        
    }
}

exports.getSectionByIndustry = async (req, res) =>{
    try {
        console.log(req.params._id);
        
        let sectionList = await SectionModel.find({
            industry_type: mongoose.Types.ObjectId(req.params._id)
        });
        if(sectionList){
            res.status(200).send({
                message: "List of Section",
                response: sectionList
            })
        } else {
            res.status(200).send({
                message: "Unable to fetch data Please try again"
            })
        }
        
    } catch (error) {
        
    }
}

exports.vehicletype = async (req, res) => {
    try {
        if(req.method == "POST"){

            let newData = await VehicletypeModel.create(req.body);
            if(newData){
                res.status(200).send({
                    message: "Created Successfully",
                    response: newData
                })
            } else {
                res.status(200).send({
                    message: "Unable to Create",
                    response:[]
                })
            }
        }
        if(req.method == "PUT"){
            let updateData = req.body;
            let _id = mongoose.Types.ObjectId(req.params._id);
            let updatedData = await VehicletypeModel.findByIdAndUpdate(_id,{
                $set: updateData
            },{
                new: true
            });
            if(updatedData){
                res.status(200).send({
                    message: "updated Successfully",
                    response: updatedData
                })
            } else {
                res.status(200).send({
                    message: "Unable to Update ",
                    response:[]
                })
            }
        }
        if(req.method == "GET"){
            let dataList = await VehicletypeModel.find();
            if(dataList){
                res.status(200).send({
                    message: "Successfull",
                    response: dataList
                })
            } else {
                res.status(200).send({
                    message: "Unable to fetch data Please try again"
                })
            }
            
        }
        if(req.method == "DELETE"){
            let deletedData = await VehicletypeModel.remove({
                _id: req.params._id
            });
            if(deletedData){
                res.status(200).send({
                    message: "Deleted Successfully",
                    response: deletedData
                })
            } else {
                res.status(200).send({
                    message: "unable to delete the industry"
                })
            }

        }
    } catch (error) {
        console.log("*****************",error,"***********************");
        res.status(200).send({
            message: "some error occurred",
            response:[]
        })
    }
}

exports.licenseType = async (req, res)=>{
    try {
        if(req.method == "POST"){
            
            let newData = await licenseTypeModel.create(req.body);

            if(newData){
                res.status(200).send({
                    message: "Created Successfully",
                    response: newData
                })
            } else {
                res.status(200).send({
                    message: "Unable to Create",
                    response:[]
                })
            }
        }
        if(req.method == "PUT"){
            let updateData = req.body;
            let _id = mongoose.Types.ObjectId(req.params._id);
            let updatedData = await licenseTypeModel.findByIdAndUpdate(_id,{
                $set: updateData
            },{
                new: true
            });
            if(updatedData){
                res.status(200).send({
                    message: "updated Successfully",
                    response: updatedData
                })
            } else {
                res.status(200).send({
                    message: "Unable to Update ",
                    response:[]
                })
            }
        }
        if(req.method == "GET"){
            let dataList = await licenseTypeModel.find();
            if(dataList){
                res.status(200).send({
                    message: "Successfull",
                    response: dataList
                })
            } else {
                res.status(200).send({
                    message: "Unable to fetch data Please try again"
                })
            }
            
        }
        if(req.method == "DELETE"){
            let deletedData = await licenseTypeModel.remove({
                _id: req.params._id
            });
            if(deletedData){
                res.status(200).send({
                    message: "Deleted Successfully",
                    response: deletedData
                })
            } else {
                res.status(200).send({
                    message: "unable to delete the industry"
                })
            }

        }
    } catch (error) {
        console.log("*****************",error,"***********************");
        res.status(200).send({
            message: "some error occurred",
            response:[]
        })
    }
}

exports.govermentIdType = async (req, res)=>{
    try {
        if(req.method == "POST"){

            let newData = await GovermentIdModel.create(req.body);
            if(newData){
                res.status(200).send({
                    message: "Created Successfully",
                    response: newData
                })
            } else {
                res.status(200).send({
                    message: "Unable to Create",
                    response:[]
                })
            }
        }
        if(req.method == "PUT"){
            let updateData = req.body;
            let _id = mongoose.Types.ObjectId(req.params._id);
            let updatedData = await GovermentIdModel.findByIdAndUpdate(_id,{
                $set: updateData
            },{
                new: true
            });
            if(updatedData){
                res.status(200).send({
                    message: "updated Successfully",
                    response: updatedData
                })
            } else {
                res.status(200).send({
                    message: "Unable to Update ",
                    response:[]
                })
            }
        }
        if(req.method == "GET"){
            let dataList = await GovermentIdModel.find();
            if(dataList){
                res.status(200).send({
                    message: "Successfull",
                    response: dataList
                })
            } else {
                res.status(200).send({
                    message: "Unable to fetch data Please try again"
                })
            }
            
        }
        if(req.method == "DELETE"){
            let deletedData = await GovermentIdModel.remove({
                _id: req.params._id
            });
            if(deletedData){
                res.status(200).send({
                    message: "Deleted Successfully",
                    response: deletedData
                })
            } else {
                res.status(200).send({
                    message: "unable to delete the industry"
                })
            }

        }
    } catch (error) {
        console.log("*****************",error,"***********************");
        res.status(200).send({
            message: "some error occurred",
            response:[]
        })
    }
}
exports.professions = async (req, res)=>{
    try {
        if(req.method == "POST"){

            let newData = await professions.create(req.body);
            if(newData){
                res.status(200).send({
                    message: "Created Successfully",
                    response: newData
                })
            } else {
                res.status(200).send({
                    message: "Unable to Create",
                    response:[]
                })
            }
        }
        if(req.method == "PUT"){
            let updateData = req.body;
            let _id = mongoose.Types.ObjectId(req.params._id);
            let updatedData = await professions.findByIdAndUpdate(_id,{
                $set: {updateData}
            },{
                new: true
            });
            if(updatedData){
                res.status(200).send({
                    message: "updated Successfully",
                    response: updatedData
                })
            } else {
                res.status(200).send({
                    message: "Unable to Update ",
                    response:[]
                })
            }
        }
        if(req.method == "GET"){
            let dataList = await professions.find();
            if(dataList){
                res.status(200).send({
                    message: "Successfull",
                    response: dataList
                })
            } else {
                res.status(200).send({
                    message: "Unable to fetch data Please try again"
                })
            }
            
        }
        if(req.method == "DELETE"){
            let deletedData = await professions.remove({
                _id: req.params._id
            });
            if(deletedData){
                res.status(200).send({
                    message: "Deleted Successfully",
                    response: deletedData
                })
            } else {
                res.status(200).send({
                    message: "unable to delete the industry"
                })
            }

        }
    } catch (error) {
        console.log("*****************",error,"***********************");
        res.status(200).send({
            message: "some error occurred",
            response:[]
        })
    }
}

exports.getProfessionsBySection = async (req, res) =>{
    try {
        console.log(req.params._id);
        
        let list = await professions.find({
            section_id: mongoose.Types.ObjectId(req.params._id)
        });
        if(list){
            res.status(200).send({
                message: "List Available",
                response: list
            })
        } else {
            res.status(200).send({
                message: "Unable to fetch data Please try again"
            })
        }
        
    } catch (error) {
        console.log("*****************",error,"***********************");
        res.status(200).send({
            message: "some error occurred",
            response:[]
        })
    }
}