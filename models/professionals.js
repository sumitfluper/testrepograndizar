//professionalSchema 
const {mongoose, conn} = require('../services/mongoose');
const professionalSchema = mongoose.Schema({
    service_type : {
        type : String,
        default : '0',
    },
    pickup_address : {
        type : String,
    },
    pickup_latitude : {
        type: String,
    },
    pickup_longitude : {
        type : String, 
    },
    pickup_location : {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number] 
    },
    start_time : {
        type : String,
    },
    end_time : {
        type : String,
    },
    comments : {
        type : String,
    },
    service_name : {
        type : String,
    }
},{
    
    strict : true,
    collection : 'Professional',
    versionKey : false
});
professionalSchema.index({ pickup_location : '2dsphere' })
exports.professionalModel = conn.model('Professional', professionalSchema)