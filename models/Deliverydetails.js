
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliveryDetailsSchema = new Schema({

    delivery_status: {
        type: String,
        default: "N/A"
    },
    service_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service"
    },
    pickup_address : {
        type : String,
    },
    pickup_latitude : {
        type: Number,
    },
    pickup_longitude : {
        type : Number, 
    },
    pickup_location : {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number],
    },
    drop_address : {
        type : String,
    },
    drop_latitude : {
        type: String,
    },
    drop_longitude : {
        type : String, 
    },
    drop_location : {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number],
    },

    
    createdAt:{type: Number,default:new Date().getTime()}
},{
        collection : 'deliverydetails',
        versionKey : false
});
deliveryDetailsSchema.index({ pickup_location : '2dsphere' })
deliveryDetailsSchema.index({ drop_location : '2dsphere' })
module.exports = mongoose.model("deliverydetails", deliveryDetailsSchema);
