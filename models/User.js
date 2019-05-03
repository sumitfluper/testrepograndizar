const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let user = new Schema({
    mobile_number: {
        type: String,
        index: {
            unique: false
        }
    },
    country_code: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default:'N/A'
    },
    user_name: {
        type: String,
        default:'N/A'

    },
    is_verified: {
        type: Number,
        default: 0
    },
    is_username: {
        type: String,
        default:'N/A'
    },
    email: {
        type: String,
        default:'N/A'

    },
    gender: {
        type: String,
        default:'N/A'
    },
    dob: {
        type: String,
        default: null
    }, // YYYY-MM-DD
    profile_image: {
        type: String,
        default: null
    },
    is_profile_created: {
        type: Number,
        default: 0 // 0 = unverified 1 = verified
    },
    verification_code: {
        type: String,
        default:'N/A'
    },

    created_on: {
        type: Date
    },
    modified_on: {
        type: Date
    },
    device_token: {
        type: String,
        default:'N/A'
    },
    device_type: {
        type: Number
    },
    user_id: {
        type: String,
        default:'N/A'
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    access_token: {
        type: String,
        default:'N/A'
    },
    app_langauge: {
        type: String,
        default:'N/A'
    },
    speak_langauge: {
        type: String,
        default:'N/A'
    },
    is_blocked: {
        type: Number,
        default: 0
    },
    isUser:{
        type: Boolean,
        default: true
    },
    isDeliveryBoy:{
        type: Boolean,
        default: false
    },
    isProfessional:{
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('User', user);
