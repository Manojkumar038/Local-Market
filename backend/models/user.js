import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true}, 
    email: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/},
    password: {type: String, required: true},
    phone: { type: String, unique: true, match: /^\+?[0-9]{10,15}$/ },
    address: {
        city: {type: String}, 
        area: {type: String}, 
        landMark: {type: String}, 
        district: {type: String},
        pincode: { type: String, match: /^[0-9]{6}$/}, 
    }, 
    resetToken: { type: String },
    resetTokenExpiry: { type: Date }
}, {timestamps: true});

export default mongoose.model('User', userSchema);

