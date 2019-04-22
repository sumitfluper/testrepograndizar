const {mongoose, conn} = require('../services/mongoose');
const LocationSchema = mongoose.Schema({
    locationAdd : {
        type : String,
    },

    userId : {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    locationType:{
        type : Number,
        default:0
    },
    location : {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number],
        default:[0.00,0.00] 
    },
    createdAt:{ type : Date, default: Date.now }
},

{
        collection : 'savedlocation',
        versionKey : false
});

LocationSchema.index({ location : '2dsphere' })
exports.locationModel = conn.model('savedlocation', LocationSchema );