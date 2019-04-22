const {mongoose, conn} = require('../services/mongoose');

//CATEGORY SCHEMA
const categorySchema = mongoose.Schema({
    cat_name : {
        type: String
    },
    cat_id : {
        type: String,
    },
},{
    strict : true,
    collection: 'Category',
    versionKey: false
});

module.exports = mongoose.model('Category', categorySchema)