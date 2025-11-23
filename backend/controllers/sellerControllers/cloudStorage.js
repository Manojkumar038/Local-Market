import cloudinary, { extractPublicId } from "../../utils/cloudinaryUtils.js";

export const deleteCloudinaryImage = async (req, res) => {
    try {
        const { images } = req.body;
        if (!images || !Array.isArray(images)) {
            return res.status(400).json({
                success: false,
                message: "Images array is required",
            });
        }

        const deleted = [];

        for (const url of images) {
            const publicId = extractPublicId(url);
            // console.log("PUBLIC ID:", publicId);

            if (!publicId) continue;

            const result = await cloudinary.uploader.destroy(publicId);
            deleted.push({ url, result });
        }

        return res.status(200).json({
            success: true,
            deleted,
        });
    } catch (error) {
        console.error("Cloudinary delete many error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete images",
        });
    }
};
