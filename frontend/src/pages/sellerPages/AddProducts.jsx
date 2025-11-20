import React, { useState } from "react";
import axios from "axios";
import { uploadToCloudinary } from "../../components/UploadToCloud.jsx";

export default function AddProducts() {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    description: "",
    images: [], // Cloudinary URLs (AFTER submit)
    highlights: [],
    tags: "",
  });

  const [localImages, setLocalImages] = useState([]); 
  const [previewImages, setPreviewImages] = useState([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [loading, setLoading] = useState(false);
  const imagesRef = React.useRef([]);


  // Handle image selection Without upload
  const handleImageSelection = (e) => {
    const files = [...e.target.files];
    if (!files.length) return;

    imagesRef.current = files; // 
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };


  // Handle normal input fields
  const handleChange = (e) => {
    const { id, value } = e.target;
    setProductData((prev) => ({ ...prev, [id]: value }));
  };

  // Add highlight bullet
  const addHighlight = () => {
    if (!highlightInput.trim()) return;

    setProductData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, { detail: highlightInput }],
    }));

    setHighlightInput("");
  };

  // SUBMIT product → upload images → then save
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    

    try {
      let imageURLs = [];
      console.log("Files in imagesRef:", imagesRef.current);

     if (imagesRef.current.length > 0) {
       imageURLs = await Promise.all(
         imagesRef.current.map((file) => uploadToCloudinary(file))
       );
     }

      const payload = {
        ...productData,
        images: imageURLs,
        tags: productData.tags.split(",").map((tag) => tag.trim()),
      };

      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/add-product`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Product added successfully!");

      // Reset UI
      setProductData({
        name: "",
        price: "",
        discountPrice: "",
        stock: "",
        category: "",
        description: "",
        images: [],
        highlights: [],
        tags: "",
      });

      setLocalImages([]);
      setPreviewImages([]);
    } catch (error) {
      console.error(error);
      alert("Failed to add product!");
    }

    setLoading(false);
  };

  return (
    <>
      {/* Inline page CSS */}
      <style>{`
        .add-product-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 4%;
          animation: fadeIn 0.4s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .add-product-card {
          width: 100%;
          max-width: 650px;
          background: white;
          border-radius: 14px;
          padding: 30px;
          border: 1.5px solid #e5e7eb;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .input-group {
          display: flex;
          flex-direction: column;
          margin: 10px 0;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          border: 1.8px solid #d1d5db;
          border-radius: 10px;
          background: #fafafa;
          transition: 0.25s ease;
        }

        .input-field:focus {
          border-color: #08f2d7ff;
          background: #ffffff;
          box-shadow: 0px 0px 4px rgba(0,255,193,0.4);
        }

        .preview-img {
          width: 120px;
          height: 120px;
          border-radius: 10px;
          object-fit: cover;
          margin: 10px;
          border: 2px solid #ccc;
        }

        .highlight-pill {
          padding: 5px 12px;
          background: #e5f9f6;
          border-radius: 8px;
          margin: 4px;
          font-size: 14px;
          display: inline-block;
        }

        .submit-btn {
          padding: 12px;
          background: #38c1b1;
          border-radius: 10px;
          color: white;
          border: none;
          font-weight: 600;
          transition: 0.2s;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>

      <div className="add-product-container">
        <div className="add-product-card">
          <h2 className="text-center text-2xl font-semibold mb-4">
            Add Product
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="input-group">
              <label>Product Name</label>
              <input
                id="name"
                className="input-field"
                type="text"
                value={productData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Price */}
            <div className="input-group">
              <label>Price</label>
              <input
                id="price"
                className="input-field"
                type="number"
                value={productData.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Discount Price */}
            <div className="input-group">
              <label>Discount Price</label>
              <input
                id="discountPrice"
                className="input-field"
                type="number"
                value={productData.discountPrice}
                onChange={handleChange}
              />
            </div>

            {/* Stock */}
            <div className="input-group">
              <label>Stock</label>
              <input
                id="stock"
                className="input-field"
                type="number"
                value={productData.stock}
                onChange={handleChange}
              />
            </div>

            {/* Category */}
            <div className="input-group">
              <label>Category</label>
              <select
                id="category"
                className="input-field"
                value={productData.category}
                onChange={handleChange}
                required
              >
                <option value="">Choose category</option>
                <option value="Groceries">Groceries</option>
                <option value="Dairy">Dairy</option>
                <option value="Fruits">Fruits</option>
                <option value="Snacks">Snacks</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>

            {/* Description */}
            <div className="input-group">
              <label>Description</label>
              <textarea
                id="description"
                className="input-field"
                rows="3"
                value={productData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Tags */}
            <div className="input-group">
              <label>Tags (comma separated)</label>
              <input
                id="tags"
                className="input-field"
                type="text"
                placeholder="milk, fresh, organic"
                value={productData.tags}
                onChange={handleChange}
              />
            </div>

            {/* Highlights */}
            <div className="input-group">
              <label>Highlights</label>

              <div style={{ display: "flex", width: "100%", gap: "10px" }}>
                <input
                  className="input-field"
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="submit-btn"
                  style={{ width: "120px" }}
                >
                  Add
                </button>
              </div>

              <div>
                {productData.highlights.map((item, index) => (
                  <span key={index} className="highlight-pill">
                    {item.detail}
                  </span>
                ))}
              </div>
            </div>

            {/* Select Multiple Product Images */}
            <div className="input-group">
              <label>Product Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelection}
              />

              <div>
                {previewImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="preview"
                    className="preview-img"
                  />
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Uploading..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}