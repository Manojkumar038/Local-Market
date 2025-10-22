import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/ManageProduct.css";

const ManageProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    highlights: [{ key: "", value: "" }],
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch product data when component mounts
    const fetchProductData = async () => {
      try {
        // TODO: Replace with your actual API call
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        setProductData(data);
        setPreviewImages(data.images); // Assuming images are URLs
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHighlightChange = (index, field, value) => {
    const newHighlights = [...productData.highlights];
    newHighlights[index][field] = value;
    setProductData((prev) => ({
      ...prev,
      highlights: newHighlights,
    }));
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

    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("price", productData.price);
      formData.append("description", productData.description);
      productData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });
      formData.append("highlights", JSON.stringify(productData.highlights));

      // TODO: Replace with your actual API call
      await fetch(`/api/products/${productId}`, {
        method: "PUT",
        body: formData,
      });

      alert("Product updated successfully!");
      navigate("/seller/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="manage-product-container">
      <div className="manage-product-form">
        <button
          type="button"
          className="abort-btn"
          onClick={() => navigate(-1)}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="heading">Edit Product Details</h2>

        <form onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label>Update Product Images</label>
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
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageProduct;
