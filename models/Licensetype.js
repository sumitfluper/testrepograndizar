const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const licenseTypesSchema = new Schema({

    name: {
        type: String,
        default: "N/A"
    },
    
    createdAt:{type: Number,default:new Date().getTime()}
},{
        collection : 'licensetypes',
        versionKey : false
});
module.exports = mongoose.model("licensetypes", licenseTypesSchema);
