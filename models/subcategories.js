const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//SUBCATEGORY SCHEMA
const subCategorySchema = new Schema({
    cat_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category'
    },
    subcat_name : {
        type: String
    }
},{
    collection: 'subCategory',
    versionKey: false
});

module.exports = mongoose.model('subCategory', subCategorySchema);