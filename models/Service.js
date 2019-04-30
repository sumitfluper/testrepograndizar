const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    service_type : {
        type : String,
        default : '0',
    },
    orderId: {
        type: String,
        default:"N/A"
    },
    orderDetails:{
        type:String,
        default:"N/A"
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
        coordinates: [Number],
        default: [0.00, 0.00]
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
        default: [0.00, 0.00]
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
    delivery_captains_50 : {
        type : String,
        default : '0',
    },
    delivery_captains_100 : {
        type : String,
        default : '0',

    },
    total_captains : {
        type : String,
        default : '0',
    },
    /**
     * type 1 if order is not accepted 
     * type 2 if order is accepted 
     * type 3 if order is rejected 
     * type 4 id order is completed
     */
    orderStatus: {
       type:Number,
       default:1 
    },

    serviceCreatedBy: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    serviceGivenBy: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    createdAt:{ type : Date, default: Date.now }
},{
        collection : 'Service',
        versionKey : false
});

ServiceSchema.index({ pickup_location : '2dsphere' })
ServiceSchema.index({ drop_location : '2dsphere' })
module.exports = mongoose.model('Service', ServiceSchema);
