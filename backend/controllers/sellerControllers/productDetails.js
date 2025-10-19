import Product from '../../models/products.js';

// Add a new product
export const addProduct = async (req, res) => {
    const { storeId, images, name, description, price, highlights } = req.body;

    if (!storeId || !name || !price) {
        return res.status(400).json({ message: 'storeId, name, and price are required.' });
    }

    try {
        const product = new Product({ storeId, images, name, description, price, highlights });
        await product.save();
        return res.status(201).json({ message: 'Product listed successfully!' });
    } catch (error) {
        console.error(`Error in addProduct: ${error}`);
        return res.status(500).json({ message: 'Failed to list the product.' });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    const { productId } = req.body;

    if (!productId) return res.status(400).json({ message: 'productId is required.' });

    try {
        const result = await Product.deleteOne({ _id: productId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        return res.status(200).json({ message: 'Product removed successfully.' });
    } catch (error) {
        console.error(`Error in deleteProduct: ${error}`);
        return res.status(500).json({ message: 'Failed to remove the product.' });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    const { productId, ...updates } = req.body;

    if (!productId) return res.status(400).json({ message: 'productId is required.' });

    // Remove null or undefined fields
    const data = {};
    for (const key in updates) {
        if (updates[key] != null) data[key] = updates[key];
    }

    if (Object.keys(data).length === 0) {
        return res.status(400).json({ message: 'No valid fields to update.' });
    }

    try {
        const result = await Product.updateOne({ _id: productId }, { $set: data });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        return res.status(200).json({ message: 'Product updated successfully.' });
    } catch (error) {
        console.error(`Error in updateProduct: ${error}`);
        return res.status(500).json({ message: 'Failed to update the product.' });
    }
};

// Get all products for a store
export const getAllProducts = async (req, res) => {
    const { storeId } = req.body;

    if (!storeId) return res.status(400).json({ message: 'storeId is required.' });

    try {
        const products = await Product.find({ storeId });
        return res.status(200).json({ message: 'Products fetched successfully.', products });
    } catch (error) {
        console.error(`Error in getAllProducts: ${error}`);
        return res.status(500).json({ message: 'Failed to fetch products.' });
    }
};
