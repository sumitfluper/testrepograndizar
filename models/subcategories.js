//SUBCATEGORY SCHEMA
const subCategorySchema = mongoose.Schema({
    subCat_name : {
        type: String
    },
    cat_id : {
        type: String
    },
},{
    strict : true,
    collection: 'subCategory',
    versionKey: false
});

exports.subCategoryModel = conn.model('subCategory',subCategorySchema)
