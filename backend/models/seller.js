import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: String, required: true },
    phone: { type: String, unique: true, match: /^\+?[0-9]{10,15}$/ },

    address: {
        city: { type: String },
        area: { type: String },
        landMark: { type: String },
        district: { type: String },
        pincode: { type: String, match: /^[0-9]{6}$/ },
    },

    storeStatus: { type: Boolean, default: true },  
    storeName: { type: String },
    storeBanner: { type: String },

    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    numberOfRatings: { type: Number, default: 0 },

    description: { type: String },
    storeCreated: { type: Boolean, default: false } 

}, { timestamps: true });

export default mongoose.model('Seller', sellerSchema);
