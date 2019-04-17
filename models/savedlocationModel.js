const {mongoose, conn} = require('../services/mongoose');
const LocationSchema = mongoose.Schema({
    locationAdd : {
        type : String,
    },

    userId : {
        type : String,
    },
    location : {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number] 
    },
    createdAt:{ type : Date, default: Date.now }
},
{
        collection : 'Service',
        versionKey : false
});

ServiceSchema.index({ pickup_location : '2dsphere' })
ServiceSchema.index({ drop_location : '2dsphere' })
exports.locationModel = conn.model('locationModel', LocationSchema );