const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userDeliveryProfileSchema = new Schema({

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
    vehicle_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Vehicletypes",
        required: true
    },
    
    vehicle_number: {
        type: String,
        required: true
    },
    license_image: {
        type: String,
        default: "N/A"
    },
    insurance_number: {
        type: String,
        default: "N/A"
    },
    insurance_image: {
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
    is_approved: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Number,
        default: new Date().getTime()
    }
}, {
    collection: 'userdeliveryprofile',
    versionKey: false
});
module.exports = mongoose.model("userdeliveryprofile", userDeliveryProfileSchema);
