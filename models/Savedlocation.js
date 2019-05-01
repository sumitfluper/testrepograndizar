const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    locationAdd : {
        type : String,
    },

    userId : {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    locationType:{
        type : Number,
        default:0
    }, //1 for home 2 for office 
    location : {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number],
        default:[0.00,0.00] 
    },
    createdAt:{type: Number,default:new Date().getTime()}
},

{
        collection : 'savedlocation',
        versionKey : false
});

LocationSchema.index({ location : '2dsphere' })
module.exports = mongoose.model('savedlocation', LocationSchema);