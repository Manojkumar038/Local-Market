import React, { useState, useEffect } from "react";
import axios from "axios";
import { uploadToCloudinary } from "../../components/UploadToCloud.jsx";
import BannerPlaceholder from "../../assets/banner.svg";
import "../../styles/Setting.css";
import { useNavigate } from "react-router-dom";

export default function SellerSettings() {
  const navigate = useNavigate();

  const [storeData, setStoreData] = useState({
    storeName: "",
    storeDescription: "",
    bannerImage: "",
    storeStatus: true,
    address: {
      city: "",
      area: "",
      landMark: "",
      district: "",
      pincode: "",
    },
    storePhone: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load seller info
  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/seller/get-seller-info`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const seller = res.data;

        const formatted = {
          storeName: seller.storeName,
          storeDescription: seller.description,
          bannerImage: seller.storeBanner || BannerPlaceholder,
          storeStatus: seller.storeStatus ?? true,
          storePhone: seller.storePhone || "",
          address: {
            city: seller.address?.city || "",
            area: seller.address?.area || "",
            landMark: seller.address?.landMark || "",
            district: seller.address?.district || "",
            pincode: seller.address?.pincode || "",
          },
        };

        setStoreData(formatted);
        setOriginalData(formatted);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  // Cancel — discard changes + go back
  function handleCancel() {
    if (!originalData) return;

    if (confirm("Discard all unsaved changes and go back?")) {
      setStoreData(originalData);
      setSelectedBannerFile(null);

      if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate("/seller"); // fallback
      }
    }
  }


  function handleChange(e) {
    const { id, value } = e.target;

    // Address fields
    if (["city", "area", "landMark", "district", "pincode"].includes(id)) {
      setStoreData((prev) => ({
        ...prev,
        address: { ...prev.address, [id]: value },
      }));
      return;
    }

    // Normal fields
    setStoreData((prev) => ({ ...prev, [id]: value }));
  }

  // Store open/close toggle
  function toggleStore() {
    setStoreData((prev) => ({ ...prev, storeStatus: !prev.storeStatus }));
  }

  // Banner preview only
  function handleBannerUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedBannerFile(file);

    setStoreData((prev) => ({
      ...prev,
      bannerImage: URL.createObjectURL(file),
    }));
  }

  // Save settings — upload file only on Save
  async function saveSettings(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      let updatedBannerImage = storeData.bannerImage;

      if (selectedBannerFile) {
        updatedBannerImage = await uploadToCloudinary(selectedBannerFile);
      }

      const payload = {
        ...storeData,
        bannerImage: updatedBannerImage,
      };
      console.log(updatedBannerImage);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/create-store`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Store updated successfully!");
      setSelectedBannerFile(null);
      setOriginalData(payload);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  }

  // Send password reset email
  async function sendResetEmail() {
    try {
      const email = prompt("Enter your registered email:");
      if (!email) return;

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/send-reset-link`,
        { email }
      );

      alert("Reset link sent to your email!");
    } catch (err) {
      console.error(err);
      alert("Failed to send reset email");
    }
  }

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div className="settings-container">
      <h1 className="settings-title">Store Settings</h1>

      <form className="settings-grid" onSubmit={saveSettings}>
        {/* Store Info */}
        <section className="settings-card">
          <h2 className="card-heading">Store Information</h2>

          <div className="input-block">
            <label>Name</label>
            <input
              id="storeName"
              type="text"
              value={storeData.storeName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-block">
            <label>Description</label>
            <textarea
              id="storeDescription"
              rows={3}
              value={storeData.storeDescription}
              onChange={handleChange}
            />
          </div>

          <div className="input-block">
            <label>Phone Number</label>
            <input
              id="storePhone"
              type="text"
              placeholder="Enter phone number"
              value={storeData.storePhone}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Address Section */}
        <section className="settings-card">
          <h2 className="card-heading">Store Address</h2>

          <div className="input-block">
            <label>City</label>
            <input
              id="city"
              type="text"
              value={storeData.address.city}
              onChange={handleChange}
            />
          </div>

          <div className="input-block">
            <label>Area</label>
            <input
              id="area"
              type="text"
              value={storeData.address.area}
              onChange={handleChange}
            />
          </div>

          <div className="input-block">
            <label>Landmark</label>
            <input
              id="landMark"
              type="text"
              value={storeData.address.landMark}
              onChange={handleChange}
            />
          </div>

          <div className="input-block">
            <label>District</label>
            <input
              id="district"
              type="text"
              value={storeData.address.district}
              onChange={handleChange}
            />
          </div>

          <div className="input-block">
            <label>Pincode</label>
            <input
              id="pincode"
              type="text"
              maxLength="6"
              value={storeData.address.pincode}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Banner Upload */}
        <section className="settings-card">
          <h2 className="card-heading">Store Banner</h2>

          <img
            src={storeData.bannerImage || BannerPlaceholder}
            alt="Banner Preview"
            className="banner-preview"
          />

          <label className="upload-label">
            Change Banner
            <input type="file" accept="image/*" onChange={handleBannerUpload} />
          </label>
        </section>

        {/* Store Status */}
        <section className="settings-card">
          <h2 className="card-heading">Store Status</h2>

          <div className="toggle-row">
            <span>
              {storeData.storeStatus ? "Store is OPEN" : "Store is CLOSED"}
            </span>

            <label className="switch">
              <input
                type="checkbox"
                checked={storeData.storeStatus}
                onChange={toggleStore}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </section>

        {/* Security */}
        <section className="settings-card">
          <h2 className="card-heading">Security</h2>

          <button
            type="button"
            className="btn reset-btn"
            onClick={sendResetEmail}
          >
            Reset Password
          </button>
        </section>

        {/* Save + Cancel */}
        <div className="settings-actions">
          <button
            type="button"
            className="btn cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button className="btn save-btn" type="submit">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
