const {mongoose, conn} = require('../services/mongoose');
const adminSchema = mongoose.Schema({
    email : {
        type : String,
    },
    password : {
        type : String,
    },
    admin_id: {
        type: String
    },
    access_token: {
        type: String
    },
    profile_image: {
        type: String,
        default : null 
    },
    verification_code: {
        type: String,
    },
    is_verified : {
        type:Number,
        default:0
    },
    country_code: {
        type: String,
    },
    mobile_number: {
        type: String,
    },
    First_name : {
        type : String,
    },
    Last_name : {
        type : String,
    },
    is_profile_created: {
        type: Number,
        default:0 
    },
    profile_image: {
        type: String,
        default : null 
    },
    is_blocked: {
        type: Number,
        default: 0
    }
    
}, {
    strict: true,
    collection: 'admin',
    versionKey: false
});
exports.adminSchem = adminSchema;
exports.adminModel = conn.model('admin', adminSchema);