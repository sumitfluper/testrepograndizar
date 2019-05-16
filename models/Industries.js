const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const industrySchema = new Schema({

    name: {
        type: String,
        default: "N/A"
    },
    
    createdAt:{type: Number,default:new Date().getTime()}
},{
        collection : 'industries',
        versionKey : false
});
module.exports = mongoose.model("industries", industrySchema);
