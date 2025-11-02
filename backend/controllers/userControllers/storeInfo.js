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
            name: s.name ?? '',
            banner: s.banner ?? '', 
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
        const { storeId, name, description, banner } = req.body;

        const products = Products.find({ storeId });

       return res.status(200).json({
        products, 
        storeId, 
        name, 
        description,
        banner
       });

    } catch (error) {
        console.error(`Error from ${__dirname}`, error);
        return res.status(500).json({ message: 'Failed to fetch product details' });
    }
}
