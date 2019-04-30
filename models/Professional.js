//professionalSchema 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const professionalSchema = new Schema({
    service_type : {
        type : String,
        default : '0',
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
        default:[0.00,0.00]
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
    },
     /**
      * type 1 if order is not accepted 
      * type 2 if order is accepted 
      * type 3 if order is rejected 
      * type 4 id order is completed
      */
     orderStatus: {
             type: Number,
             default: 1
         },

         serviceCreatedBy: {
             type: mongoose.Schema.Types.ObjectId,
             ref: "User"
         },
         serviceGivenBy: {
             type: mongoose.Schema.Types.ObjectId,
             ref: "User"
         },
},{
    
    collection : 'Professional',
    versionKey : false
});
professionalSchema.index({ pickup_location : '2dsphere' })
module.exports = mongoose.model('Professional', professionalSchema)