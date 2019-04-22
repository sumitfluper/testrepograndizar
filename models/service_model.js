const {
    mongoose,
    conn
} = require('../services/mongoose');
const ServiceSchema = mongoose.Schema({
    service_type: {
        type: String,
        default: '0',
    },
    pickup_address: {
        type: String,
    },
    pickup_latitude: {
        type: String,
    },
    pickup_longitude: {
        type: String,
    },
    pickup_location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number],
        default: [0.00,0.00]
    },
    drop_address: {
        type: String,
    },
    drop_latitude: {
        type: String,
    },
    drop_longitude: {
        type: String,
    },
    drop_location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number],
        default: [0.00,0.00]
    },
    start_time: {
        type: String,
    },
    end_time: {
        type: String,
    },
    comments: {
        type: String,
    },
    delivery_captains_50: {
        type: String,
        default: '0',
    },
    delivery_captains_100: {
        type: String,
        default: '0',

    },
    total_captains: {
        type: String,
        default: '0',
    },

    is_accepted: {
        type: Boolean,
        default: false
    },
    serviceprovider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    servicedoneby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    is_completed: {
        type: Boolean,
        default: false
    },
    is_canclled: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'Service',
    versionKey: false
});

ServiceSchema.index({
    pickup_location: '2dsphere'
})
ServiceSchema.index({
    drop_location: '2dsphere'
})
exports.serviceModel = conn.model('Service', ServiceSchema);
