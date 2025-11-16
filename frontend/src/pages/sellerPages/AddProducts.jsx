import { useState, useEffect } from "react";
import "../../styles/AddProducts.css";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";



const fetchSellerProducts = async () => {
  const res = await fetch("/api/seller/get-all-products", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch seller products");
  return res.json();
};

const AddProductPage = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    highlights: [{ key: "", value: "" }],
    images: [],
  });

  const navigate = useNavigate();
  const [previewImages, setPreviewImages] = useState([]);

  const queryClient = useQueryClient();

  // ✅ Fetch all seller products & put in cache if not already there
  useQuery({
    queryKey: ["sellerProducts"],
    queryFn: fetchSellerProducts,
    staleTime: 5 * 60 * 1000, // 5 mins caching
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHighlightChange = (index, field, value) => {
    const newHighlights = [...productData.highlights];
    newHighlights[index][field] = value;
    setProductData((prev) => ({ ...prev, highlights: newHighlights }));
  };

  const addHighlight = () => {
    setProductData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, { key: "", value: "" }],
    }));
  };

  const removeHighlight = (index) => {
    setProductData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    const newPreviewImages = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviewImages]);
  };

  const removeImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("price", productData.price);
    formData.append("description", productData.description);
    formData.append("highlights", JSON.stringify(productData.highlights));
    productData.images.forEach((image) => {
      if (image instanceof File) {
        formData.append("images", image);
      }
    });

    console.log("Submitting product:", productData);

    // ✅ Future: update API here and update react-query cache

    alert("Product submitted (check console)");
  };

  return (
    <div className="add-product-container">
      <div className="add-product-form">
        <button
          type="button"
          className="abort-btn"
          onClick={() => navigate(-1)}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="heading">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Product Price */}
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Product Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>

          {/* Product Highlights */}
          <div className="form-group">
            <label>Product Highlights</label>
            <div className="highlights-container">
              {productData.highlights.map((highlight, i) => (
                <div key={i} className="highlight-row">
                  <input
                    type="text"
                    placeholder="Key"
                    value={highlight.key}
                    onChange={(e) =>
                      handleHighlightChange(i, "key", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={highlight.value}
                    onChange={(e) =>
                      handleHighlightChange(i, "value", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeHighlight(i)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="add-highlight-btn"
              onClick={addHighlight}
            >
              Add Highlight
            </button>
          </div>

          {/* Product Images */}
          <div className="form-group">
            <label>Product Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="file-input"
            />
            <div className="image-preview-container">
              {previewImages.map((src, index) => (
                <div key={index} className="image-preview">
                  <img src={src} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
