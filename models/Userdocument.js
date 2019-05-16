const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userDocumentSchema = new Schema({

    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    name:{
        type: String,
        default: "N/A"
    },
    about:{
        type: String,
        default: "N/A"
    },
    industry:[{
        type: mongoose.Schema.Types.ObjectId,
        required: true 
    }],
    section: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }],
    section_images:[{
        type: String,
        default: "N/A"
    }],
    license: {
        type: mongoose.Schema.type.ObjectId,
        required: true
    },
    license_image: {
        type: String,
        default: "N/A"
    },
    image_id_one: {
        type: String,
        default: "N/A"
    },
    image_id_two: {
        type: String,
        default: "N/A"
    },
    bank_acc_no: {
        type: String,
        default: "N/A"
    },
    phone_no: {
        type: String,
        default: "N/A"
    },
    createdAt:{type: Number,default:new Date().getTime()}
},{
        collection : 'userdocument',
        versionKey : false
});
module.exports = mongoose.model("userdocument", userDocumentSchema);
