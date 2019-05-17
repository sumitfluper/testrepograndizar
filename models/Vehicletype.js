const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({

    name: {
        type: String,
        default: "N/A"
    },
    
    createdAt:{type: Number,default:new Date().getTime()}
},{
        collection : 'Vehicletypes',
        versionKey : false
});
module.exports = mongoose.model("Vehicletypes", vehicleSchema);
