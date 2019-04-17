const {mongoose, conn} = require('../services/mongoose');
const ServiceSchema = mongoose.Schema({
    service_type : {
        type : String,
        default : '0',
    },
    pickup_address : {
        type : String,
    },
    pickup_latitude : {
        type: String,
    },
    pickup_longitude : {
        type : String, 
    },
    pickup_location : {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number] 
    },
    drop_address : {
        type : String,
    },
    drop_latitude : {
        type: String,
    },
    drop_longitude : {
        type : String, 
    },
    drop_location : {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number] 
    },
    start_time : {
        type : String,
    },
    end_time : {
        type : String,
    },
    comments : {
        type : String,
    },
    delivery_captains_50 : {
        type : String,
        default : '0',
    },
    delivery_captains_100 : {
        type : String,
        default : '0',

    },
    total_captains : {
        type : String,
        default : '0',
    },
    
    is_accepted: {
       type:Boolean,
       default:false 
    },
    serviceprovider: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    servicedoneby: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    is_completed: {
       type:Boolean,
       default:false 
    },
    is_canclled: {
       type:Boolean,
       default:false 
    },
    createdAt:{ type : Date, default: Date.now }
},{
        collection : 'Service',
        versionKey : false
});

ServiceSchema.index({ pickup_location : '2dsphere' })
ServiceSchema.index({ drop_location : '2dsphere' })
exports.serviceModel = conn.model('Service', ServiceSchema );


//professionalSchema 
const professionalSchema = mongoose.Schema({
    service_type : {
        type : String,
        default : '0',
    },
    pickup_address : {
        type : String,
    },
    pickup_latitude : {
        type: String,
    },
    pickup_longitude : {
        type : String, 
    },
    pickup_location : {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number] 
    },
    start_time : {
        type : String,
    },
    end_time : {
        type : String,
    },
    comments : {
        type : String,
    },
    service_name : {
        type : String,
    }
},{
    
    strict : true,
    collection : 'Professional',
    versionKey : false
});
professionalSchema.index({ pickup_location : '2dsphere' })
exports.professionalModel = conn.model('Professional', professionalSchema)


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

exports.categoryModel = conn.model('Category',categorySchema)


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
