import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    coverPhoto: {type: String, required: true}, 
    images: [{type: String}],
    name: {type: String, required: true}, 
    description: {type: String}, 
    category: { type: String},
    price: { type: Number, required: true}, 
    stock: { type: Number, default: 0 },
    discountPrice: { type: Number },
    tags: [{ type: String }],
    rating: { type: Number, default: 0 }, 
    NumberOfPeoplePurchased: { type: Number, default: 0 },
    highlights: [{detail: {type: String}}],
    isActive: { type: Boolean, default: true }
}, {timestamps: true});


export default mongoose.model('Product', productSchema);

