import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/ProductDetails.css";

export default function SellerProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/seller/get-product-details/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProduct(res.data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!product) return <p className="error">Product not found</p>;

  return (
    <div className="fk-wrapper">
      {/* HEADER */}
      <header className="fk-header">
        <button onClick={() => navigate(-1)}>←</button>
        <h3>Product Preview</h3>
        <button
          onClick={() => navigate(`/seller/manage-product/${product._id}`)}
        >
          Edit
        </button>
      </header>

      <div className="fk-container">
        {/* IMAGE SECTION */}
        <div className="fk-images">
          <div className="fk-carousel">
            <img src={product.images?.[activeIndex]} alt="Product" />
          </div>

          <div className="fk-dots">
            {product.images?.map((_, i) => (
              <span
                key={i}
                className={activeIndex === i ? "dot active" : "dot"}
                onClick={() => setActiveIndex(i)}
              ></span>
            ))}
          </div>

          <div className="fk-thumbs">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                className={i === activeIndex ? "thumb active" : "thumb"}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="fk-details">
          <h1 className="fk-title">{product.name}</h1>

          <div className="fk-rating">
            ⭐ {product.rating} | {product.NumberOfPeoplePurchased} sold
          </div>

          <div className="fk-price-row">
            <span className="fk-price">₹{product.price}</span>
            <span
              className={product.stock > 0 ? "fk-stock in" : "fk-stock out"}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <p className="fk-desc">{product.description}</p>

          {/* TAGS */}
          <div className="fk-tags">
            {product.tags?.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>

          {/* HIGHLIGHTS */}
          <div className="fk-highlight-box">
            <h4>Highlights</h4>
            <ul>
              {product.highlights?.map((h, i) => (
                <li key={i}>{h.detail}</li>
              ))}
            </ul>
          </div>

          {/* STATUS */}
          <div className="fk-status">
            <span>Status: {product.isActive ? "ACTIVE" : "INACTIVE"}</span>
            <span>Stock: {product.stock}</span>
          </div>

          {/* CTA */}
          <div className="fk-actions">
            <button
              onClick={() => navigate(`/seller/manage-product/${product._id}`)}
            >
              Edit Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
