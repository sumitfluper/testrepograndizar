const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GovermentidSchema = new Schema({

    name: {
        type: String,
        default: "N/A"
    },
    
    createdAt:{type: Number,default:new Date().getTime()}
},{
        collection : 'govermentsid',
        versionKey : false
});
module.exports = mongoose.model("govermentsid", GovermentidSchema);
