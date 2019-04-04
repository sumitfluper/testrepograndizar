const {mongoose, conn} = require('../services/mongoose');
const UserSchema = mongoose.Schema({
   
    mobile_number: {
        type: String,
        index: {
            unique: false
        }
    },
    country_code: {
        type: String, 
        default : null
    },
    name: {
        type: String
    },
    user_name:
    {
        type: String
        
    },
    is_verified:
    {
        type:Number,
        default:0
    },
    is_username:
    {
       type:String,
    },
    email: {
        type: String
        
    },
    gender: {
        type: String,
        default : null
    },
    dob: {
        type: String,
        default : null 
    }, // YYYY-MM-DD
    profile_image: {
        type: String,
        default : null 
    },
    is_profile_created:
    {
        type: Number,
        default : 0 // 0 = unverified 1 = verified
    },
    verification_code: {
        type: String
    },
   
     created_on: {
        type: Date
    },
	 modified_on: {
        type: Date
    },
    device_token: {
        type: String
    },
    device_type: {
        type: Number
    },
    user_id: {
        type: String
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    access_token: {
        type: String
    }, 
    app_langauge: {
        type: String
    },
    speak_langauge: {
        type: String
    },
    is_blocked: {
        type: Number,
        default: 0
    }
    
});
exports.UserModel = conn.model('User', UserSchema );
