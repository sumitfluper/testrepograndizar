const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//CATEGORY SCHEMA
const categorySchema = new Schema({
    cat_name : {
        type: String
    },
    cat_id : {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
        require: true
    },
},{
    collection: 'Category',
    versionKey: false
});

module.exports = mongoose.model('Category', categorySchema)