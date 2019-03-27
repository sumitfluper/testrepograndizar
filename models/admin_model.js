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
    }
}, {
    strict: true,
    collection: 'admin',
    versionKey: false
});
exports.adminSchem = adminSchema;
exports.adminModel = conn.model('admin', adminSchema);