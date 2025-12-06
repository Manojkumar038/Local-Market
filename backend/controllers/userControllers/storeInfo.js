import Seller from '../../models/seller.js';
import Products from '../../models/products.js';
import { fileURLToPath } from 'url';
import  path  from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getStores = async (req, res) => {
    try {
        const stores = await Seller.find({});

        const result = stores.map(s => ({
            id: s._id.toString(),
            name: s.storeName ?? '',
            banner: s.storeBanner ?? '', 
            description: s.description ?? ''
        }))

        return res.status(200).json({ stores: result });

    } catch (error) {
        console.error(`Error from ${__dirname}`, error);
        return res.status(500).json({ message: 'Failed to fetch stores' });
    }
}

export const getStoreInfo = async (req, res) => {
    try {
        const { id } = req.query; 

        const store = await Seller.findById(id);

        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        const products = await Products.find({ storeId: id });

        // Return everything frontend needs
        return res.status(200).json({
            store: {
                id: store._id,
                name: store.storeName,
                description: store.description,
                banner: store.storeBanner,
            },
            products
        });

    } catch (error) {
        console.error("Error fetching store info:", error);
        return res.status(500).json({ message: "Failed to fetch store data" });
    }
};

export const getProductDetails = async (req, res) => {

    try {
        const { productId } = req.params;
        if (!productId) return res.status(400).json({ success: false, message: "Product Id is required." });

        const product = await Products.findOne({ _id: productId });
        // console.log(product);
        if (!product) return res.status(404).json({ success: false, message: "Product not found." });

        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error(`Error in getProductDetails: ${error}`);
        return res.status(500).json({ message: 'Failed to fetch product details.' });
    }
}