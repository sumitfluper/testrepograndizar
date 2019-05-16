const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionSchema = new Schema({

    name: {
        type: String,
        default: "N/A"
    },
    industry_type:{
        type:  mongoose.Schema.type.ObjectId,
        ref: 'industries'
    },
    
    createdAt:{type: Number,default:new Date().getTime()}
},{
        collection : 'sections',
        versionKey : false
});
module.exports = mongoose.model("sections", sectionSchema);
