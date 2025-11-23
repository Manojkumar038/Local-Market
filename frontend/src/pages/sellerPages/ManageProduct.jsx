import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { uploadToCloudinary } from "../../components/UploadToCloud";
import "../../styles/ManageProduct.css";

export default function ManageProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);

  const [images, setImages] = useState([]); // [{ src, file }]
  const [newImages, setNewImages] = useState([]); // File[]
  const [deletedImages, setDeletedImages] = useState([]); // URLs to delete

  const newObjectUrlsRef = useRef([]);
  const [tagInput, setTagInput] = useState("");

  // ----------------------------
  // FETCH PRODUCT
  // ----------------------------
  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/seller/get-product-details/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data.product;
        if (!mounted) return;

        // Set main product data
        setProductData({
          name: data.name || "",
          description: data.description || "",
          price: data.price ?? 0,
          stock: data.stock ?? 0,
          tags: Array.isArray(data.tags) ? data.tags : [],
          highlights: Array.isArray(data.highlights)
            ? data.highlights.map((h) => ({
                _id: h._id || null,
                detail: h.detail || "",
              }))
            : [{ detail: "" }],
          isActive: data.isActive ?? true,
          rating: data.rating ?? 0,
          NumberOfPeoplePurchased: data.NumberOfPeoplePurchased ?? 0,
        });

        // Load existing images
        const existing = Array.isArray(data.images)
          ? data.images.map((url) => ({ src: url, file: null }))
          : [];
        setImages(existing);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
      newObjectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      newObjectUrlsRef.current = [];
    };
  }, [productId]);

  // ----------------------------
  // INPUT HANDLERS
  // ----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    const numeric = ["price", "stock", "rating", "NumberOfPeoplePurchased"];

    setProductData((prev) => ({
      ...prev,
      [name]: numeric.includes(name) ? Number(value) : value,
    }));
  };

  // ----------------------------
  // TAGS
  // ----------------------------
  const addTagFromInput = () => {
    const raw = tagInput.trim();
    if (!raw) return;

    const parts = raw
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    setProductData((prev) => {
      const updated = [...prev.tags];
      parts.forEach((p) => {
        if (!updated.includes(p)) updated.push(p);
      });
      return { ...prev, tags: updated };
    });

    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTagFromInput();
    }
    if (e.key === "Backspace" && tagInput === "") {
      setProductData((prev) => ({
        ...prev,
        tags: prev.tags.slice(0, -1),
      }));
    }
  };

  const removeTag = (index) => {
    setProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  // ----------------------------
  // HIGHLIGHTS
  // ----------------------------
  const handleHighlightChange = (i, value) => {
    setProductData((prev) => {
      const updated = [...prev.highlights];
      updated[i].detail = value;
      return { ...prev, highlights: updated };
    });
  };

  const addHighlight = () =>
    setProductData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, { detail: "" }],
    }));

  const removeHighlight = (i) =>
    setProductData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== i),
    }));

  // ----------------------------
  // IMAGES
  // ----------------------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newObjs = files.map((file) => {
      const url = URL.createObjectURL(file);
      newObjectUrlsRef.current.push(url);
      return { src: url, file };
    });

    setImages((prev) => [...prev, ...newObjs]);
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    const img = images[index];
    if (!img) return;

    // If existing image, mark for deletion
    if (!img.file) {
      setDeletedImages((prev) => [...prev, img.src]);
    } else {
      // If new image, remove from pending uploads
      setNewImages((prev) =>
        prev.filter((file) => file.name !== img.file.name)
      );
      URL.revokeObjectURL(img.src);
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleIsActive = () =>
    setProductData((prev) => ({ ...prev, isActive: !prev.isActive }));

  // ----------------------------
  // SUBMIT FORM
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Upload NEW images to Cloudinary
      const uploadedUrls = [];
      for (const file of newImages) {
        const url = await uploadToCloudinary(file);
        uploadedUrls.push(url);
      }

      // 2️⃣ Final image list = existing not removed + new uploads
      const finalImages = [
        ...images.filter((img) => img.file === null).map((img) => img.src),
        ...uploadedUrls,
      ];

      // 3️⃣ Request backend to delete removed images
      if (deletedImages.length > 0) {
        await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/seller/delete-cloudinary-image`,
          { images: deletedImages },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // 4️⃣ Update product details with final images
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/update-product`,
        {
          productId,
          ...productData,
          images: finalImages,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Product updated successfully!");
      navigate("/seller");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed. See console for details.");
    }
  };

  // ----------------------------
  // LOADING
  // ----------------------------
  if (loading || !productData) {
    return <h2 style={{ padding: 20 }}>Loading product…</h2>;
  }

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="manage-wrapper">
      <header className="top-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Edit Product</h1>
      </header>

      <form className="modern-form" onSubmit={handleSubmit}>
        {/* BASIC INFO */}
        <section className="section-card">
          <h2 className="section-title">Basic Information</h2>

          <div className="input-group">
            <label>Product Name</label>
            <input
              name="name"
              value={productData.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Price (₹)</label>
              <input
                name="price"
                type="number"
                value={productData.price}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Stock</label>
              <input
                name="stock"
                type="number"
                value={productData.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              rows={4}
              name="description"
              value={productData.description}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* TAGS */}
        <section className="section-card">
          <h2 className="section-title">Tags</h2>
          <div className="tags-container">
            {productData.tags.map((t, i) => (
              <span className="tag-chip" key={i}>
                {t}
                <button type="button" onClick={() => removeTag(i)}>
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="tags-input-row">
            <input
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
            <button
              type="button"
              className="small-button"
              onClick={addTagFromInput}
            >
              Add
            </button>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="section-card">
          <h2 className="section-title">Highlights</h2>

          {productData.highlights.map((h, i) => (
            <div className="highlight-box" key={i}>
              <textarea
                rows={2}
                value={h.detail}
                onChange={(e) => handleHighlightChange(i, e.target.value)}
              />
              <button
                className="remove-highlight"
                onClick={() => removeHighlight(i)}
              >
                ×
              </button>
            </div>
          ))}

          <button
            type="button"
            className="add-highlight-btn"
            onClick={addHighlight}
          >
            + Add Highlight
          </button>
        </section>

        {/* IMAGES */}
        <section className="section-card">
          <h2 className="section-title">Images</h2>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />

          <div className="image-grid">
            {images.map((img, i) => (
              <div className="image-item" key={i}>
                <img src={img.src} />
                <button className="delete-image" onClick={() => removeImage(i)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* STATUS */}
        <section className="section-card">
          <h2 className="section-title">Product Status</h2>

          <div className="switch-row">
            <span>Active Product</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={productData.isActive}
                onChange={toggleIsActive}
              />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        {/* META */}
        <section className="input-row section-card">
          <div className="input-group">
            <label>Total Purchases</label>
            <input
              name="NumberOfPeoplePurchased"
              type="number"
              value={productData.NumberOfPeoplePurchased}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Rating</label>
            <input
              name="rating"
              type="number"
              step="0.1"
              value={productData.rating}
              onChange={handleChange}
            />
          </div>
        </section>

        <button className="save-button">Save Changes</button>
      </form>
    </div>
  );
}
