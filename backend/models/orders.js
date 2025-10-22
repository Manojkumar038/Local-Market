import mongoose from 'mongoose';

const orders = new mongoose.Schema({

    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    sellerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }, 

    address: {
        fullName: { type: String, required: true },
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        state: { type: String },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
    },

    payment: {
        method: { type: String, required: true },
        transactionId: { type: String },
        amount: { type: Number, required: true },
        status: { type: String, required: true },
    }

});