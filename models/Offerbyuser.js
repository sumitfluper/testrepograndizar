const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferbyuserSchema = new Schema({

    serviceId: {type:mongoose.Schema.Types.ObjectId,ref:"Service"},
    serviceCreatedBy: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    serviceGivenBy: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    deliveryCharge:{
        type: String,
    },
    deliveryMessage:{
        type: String,
    },
    deliveryTime:{
        type: String,
    },
    /**
     * type 1 if order is not accepted 
     * type 2 if order is accepted 
     * type 3 if order is rejected 
     * type 4 id order is completed
     */
    offerStatus: {
       type:Number,
       default:1 
    },
    
    createdAt:{type: Number,default:new Date().getTime()}
},{
        collection : 'Offerbyusers',
        versionKey : false
});
module.exports = mongoose.model('Offerbyusers', OfferbyuserSchema);
