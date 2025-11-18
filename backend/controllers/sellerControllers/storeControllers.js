import Seller from "../../models/seller.js";

export const createOrUpdateStore = async (req, res) => {
    try {
        const sellerId = req.user.userId; 
        console.log(sellerId)
        const {
            storeName,
            storeDescription,
            storeBanner,
            address
        } = req.body;

        if (!storeName) {
            return res.status(400).json({ message: "Store name is required" });
        }
        
        if (!address || !address.city || !address.pincode) {
            return res.status(400).json({ message: "Address fields are incomplete" });
        }
        
        // Update seller document
        const updatedSeller = await Seller.findByIdAndUpdate(
            sellerId,
            {
                storeName,
                description: storeDescription,
                storeBanner,
                address,
                storeCreated: true
            },
            { new: true }
        );
        
        

        if (!updatedSeller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        res.status(200).json({
            message: "Store created/updated successfully",
            seller: updatedSeller
        });

    } catch (error) {
        console.error("Error in createOrUpdateStore:", error);
        res.status(500).json({ message: "Failed to create store" });
    }
};
