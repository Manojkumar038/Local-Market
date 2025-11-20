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
    <>
      <style>{`

        .text-2xl {
          font-size: 26px;
          font-weight: 600;
        }

        .create-store-container {
          animation: fadeIn 0.4s ease-in-out;
          display: flex;
          justify-content: center;
          align-items: center;
          
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .create-store-card {
          width: 100%;
          margin: 2%;
          max-width: 650px;
          background: white;
          border-radius: 14px;
          border: 1.5px solid #e5e7eb;
          padding: 50px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          transition: 0.3s ease;
        }

        .create-store-card:hover {
          box-shadow: 0 12px 28px rgba(0,0,0,0.12);
        }


        .input-group input,
        .input-group textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.8px solid #d1d5db; /* Gray-300 */
          border-radius: 10px;
          outline: none;
          background: #fafafa;
          transition: 0.25s ease;
          font-size: 0.95rem;
        }

        .input-group input:hover,
        .input-group textarea:hover {
          border-color: #9ca3af; /* Gray-400 */
        }

        .input-group input:focus,
        .input-group textarea:focus {
          border-color: #28e7b7ff; /* Blue-600 */
          background: white;
          box-shadow: 0px 0px 6px rgba(37, 99, 235, 0.35);
          transform: translateY(-1px);
        }

        /* Placeholder style */
        .input-group input::placeholder,
        .input-group textarea::placeholder {
          color: #9ca3af;
        }

        .section-title {
          font-weight: 600;
          color: #1f2937;        
          font-size: 15.5px;
          margin-bottom: 8px;
          letter-spacing: 0.4px;  
        }



        /* Banner preview */
        .banner-image {
          transition: 0.3s ease;
          border-radius: 8px;
          border: 2px solid transparent;
        }

        .banner-image:hover {
          border-color: #3b82f6;
          transform: scale(1.02);
        }

        /* Button styling */
        .create-store-btn {
          margin-top: 20px;
          transition: 0.3s ease;
          height: 36px;
          width: 120px;
          border-radius: 16px;
          color: black;
          font-weight: 500;
          border: 1px solid black;
          background-color: #3bf6daff;
        }

        .create-store-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }
`}</style>

      <div className="create-store-container w-full min-h-screen bg-gray-100">
        <div className="create-store-card">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Open Your Store Online
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {/* Store Name */}
            <div className="input-group">
              <label className="section-title text-sm">Store Name</label>
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
            <div className="input-group">
              <label className="section-title text-sm">Store Description</label>
              <textarea
                id="storeDescription"
                rows={4}
                className="w-full px-4 py-2 border rounded-md mt-1"
                value={formData.storeDescription}
                onChange={handleChange}
              />
            </div>

            {/* Banner */}
            <div className="input-group">
              <label className="section-title text-sm">Store Banner</label>
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
                  className="banner-image w-full h-40 object-cover mt-3 border"
                />
              )}
            </div>

            {/* Address */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="input-group">
                <label className="section-title text-sm">City</label>
                <input
                  id="city"
                  type="text"
                  className="w-full px-4 py-2 border rounded-md mt-1"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label className="section-title text-sm">Area</label>
                <input
                  id="area"
                  type="text"
                  className="w-full px-4 py-2 border rounded-md mt-1"
                  value={formData.area}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label className="section-title text-sm">Landmark</label>
                <input
                  id="landMark"
                  type="text"
                  className="w-full px-4 py-2 border rounded-md mt-1"
                  value={formData.landMark}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label className="section-title text-sm">District</label>
                <input
                  id="district"
                  type="text"
                  className="w-full px-4 py-2 border rounded-md mt-1"
                  value={formData.district}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label className="section-title text-sm">Pincode</label>
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
              className="create-store-btn w-full py-3 mt-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              {loading ? "Creating Store..." : "Create Store"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
