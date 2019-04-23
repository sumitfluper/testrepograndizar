const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({

    serviceId: {type:mongoose.Schema.Types.ObjectId,ref:"Service"},
    generatedBy: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    generatedto: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    deliveryCharge:{
        type: String,
    },
    /**
     * type 1 if order is Cancelled 
     * type 2 id order is completed
     */
    invoiceStatus: {
       type:Number,
       default:1 
    },
    
    createdAt:{ type : Date, default: Date.now }
},{
        collection : 'invoices',
        versionKey : false
});
module.exports = mongoose.model('invoices', InvoiceSchema);
