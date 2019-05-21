const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProfessionalProfileSchema = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    profile_image: {
        type: String,
        default: "N/A"
    },
    id_image_one: {
        type: String,
        default: "N/A"
    },
    id_image_two: {
        type: String,
        default: "N/A"
    },
    name: {
        type: String,
        default: "N/A"
    },
    about: {
        type: String,
        default: "N/A"
    },
    industry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'industries',
        required: true
    },
  
    section_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sections',
        required: true
    },

    professional_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'licensetypes',
        required: true
    },
 
    goverment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'govermentsid',
        required: true
    },

    user_profession: {
        type: String,
        required: true
    },
 
    certificate_image: {
        type: String,
        default: "N/A"
    },
    vehicle_number: {
        type: String,
        default: "N/A"
    },
    
    license_image: {
        type: String,
        default: "N/A"
    },
    
    bank_acc_number: {
        type: String,
        default: "N/A"
    },
    emergrncy_contact: {
        type: String,
        default: "N/A"
    },
    is_updated_professional:{
        type: Number,
        default: 0
    },
    is_approved: {
        type: Number,
        default: 0
    },
    
    createdAt: {
        type: Number,
        default: new Date().getTime()
    }
}, {
    collection: 'userprofessionalprofile',
    versionKey: false
});
module.exports = mongoose.model("userprofessionalprofile", userProfessionalProfileSchema);
