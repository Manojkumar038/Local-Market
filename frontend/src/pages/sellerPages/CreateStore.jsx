import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateStore() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
    storeBanner: "",
    city: "",
    area: "",
    landMark: "",
    district: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);

  const uploadToCloud = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "your_preset");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      data
    );

    return res.data.secure_url;
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBannerPreview(URL.createObjectURL(file));

    const uploadedUrl = await uploadToCloud(file);
    setFormData((prev) => ({ ...prev, storeBanner: uploadedUrl }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/create-store`,
        {
          storeName: formData.storeName,
          storeDescription: formData.storeDescription,
          storeBanner: formData.storeBanner,
          address: {
            city: formData.city,
            area: formData.area,
            landMark: formData.landMark,
            district: formData.district,
            pincode: formData.pincode,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Store created successfully!");
      navigate("/seller");
    } catch (error) {
      console.error(error);
      alert("Store creation failed!");
    }

    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-gray-50 py-12">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create Your Store
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium">Store Name</label>
            <input
              id="storeName"
              type="text"
              className="w-full px-4 py-2 border rounded-md mt-1"
              value={formData.storeName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Store Description */}
          <div>
            <label className="block text-sm font-medium">
              Store Description
            </label>
            <textarea
              id="storeDescription"
              rows={4}
              className="w-full px-4 py-2 border rounded-md mt-1"
              value={formData.storeDescription}
              onChange={handleChange}
            />
          </div>

          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-medium">Store Banner</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="mt-2"
            />
            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="Preview"
                className="w-full h-40 object-cover mt-3 rounded-md border"
              />
            )}
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                id="city"
                type="text"
                className="w-full px-4 py-2 border rounded-md mt-1"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Area</label>
              <input
                id="area"
                type="text"
                className="w-full px-4 py-2 border rounded-md mt-1"
                value={formData.area}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Landmark</label>
              <input
                id="landMark"
                type="text"
                className="w-full px-4 py-2 border rounded-md mt-1"
                value={formData.landMark}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">District</label>
              <input
                id="district"
                type="text"
                className="w-full px-4 py-2 border rounded-md mt-1"
                value={formData.district}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Pincode</label>
              <input
                id="pincode"
                type="text"
                pattern="[0-9]{6}"
                className="w-full px-4 py-2 border rounded-md mt-1"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Creating Store..." : "Create Store"}
          </button>
        </form>
      </div>
    </div>
  );
}
