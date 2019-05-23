
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
    
    drop_address : {
        type : String,
        default: 'N/A'
    },
    drop_latitude : {
        type: Number,
        default: 0.00
    },
    drop_longitude : {
        type : Number,
        default: 0.00 
    },
    

    
    createdAt:{type: Number,default:new Date().getTime()}
},{
        collection : 'deliverydetails',
        versionKey : false
});

module.exports = mongoose.model("deliverydetails", deliveryDetailsSchema);
