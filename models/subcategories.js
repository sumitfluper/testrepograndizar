const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//SUBCATEGORY SCHEMA
const subCategorySchema = new Schema({
    subCat_name : {
        type: String
    },
    cat_id : {
        type: String
    },
},{
    collection: 'subCategory',
    versionKey: false
});

module.exports = mongoose.model('subCategory', subCategorySchema);
