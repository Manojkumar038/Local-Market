import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    images: [{type: String}],
    name: {type: String, required: true}, 
    description: {type: String}, 
    price: { type: Number, required: true}, 
    rating: { type: Number, default: 0 }, 
    NumberOfPeoplePurchased: { type: Number, default: 0 },
    highlights: [{detail: {type: String}}]
}, {timestamps: true});


export default mongoose.model('Product', productSchema);

