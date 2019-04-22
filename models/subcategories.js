const mongoose = require('mongoose');

//SUBCATEGORY SCHEMA
const subCategorySchema = mongoose.Schema({
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
