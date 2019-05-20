const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const professionsidSchema = new Schema({

    name: {
        type: String,
        default: "N/A"
    },
    industry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'industries'
    },
    section_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sections'
    },
    
    createdAt:{type: Number,default:new Date().getTime()}
},{
        collection : 'professions',
        versionKey : false
});
module.exports = mongoose.model("professions", professionsidSchema);
