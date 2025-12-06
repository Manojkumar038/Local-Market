import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/UserStyles/ProductPage.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/UserNavBar.jsx";

export default function ProductPage() {
  const { id } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/user/get-product-info/${id}`
        );
        const p = res.data.product;
        setProduct(p);
        setMainImage(p.coverPhoto || p.images?.[0]);
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, backendUrl]);

  if (loading) return <div className="p-center">Loading product…</div>;
  if (error) return <div className="p-center error">{error}</div>;
  if (!product) return <div className="p-center">Product not found</div>;

  const thumbs = [product.coverPhoto, ...(product.images || [])].filter(
    Boolean
  );

  return (
    <>
      <Navbar />
      <div className="fk-wrap">
        {/* LEFT: GALLERY */}
        <section className="fk-gallery">
          <div className="fk-main-img">
            <img src={mainImage} alt={product.name} />
          </div>

          <div className="fk-thumbs">
            {thumbs.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="thumb"
                className={img === mainImage ? "active" : ""}
                onMouseEnter={() => setMainImage(img)}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>

          <div className="fk-actions">
            <button className="btn-cart">ADD TO CART</button>
            <button className="btn-buy" disabled={product.stock === 0}>
              BUY NOW
            </button>
          </div>
        </section>

        {/* RIGHT: CONTENT */}
        <section className="fk-content">
          <h1 className="fk-title">{product.name}</h1>

          <div className="fk-price-row">
            <span className="price">₹{product.price.toLocaleString()}</span>
            <span className="offer">Extra ₹1000 off</span>
          </div>

          <p className="fk-desc">{product.description}</p>

          {product.highlights?.length > 0 && (
            <div className="fk-highlights">
              <h4>Highlights</h4>
              <ul>
                {product.highlights.map((h) => (
                  <li key={h._id}>• {h.detail}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="fk-delivery">
            <p>
              Status:
              <span className={product.stock === 0 ? "out" : "in"}>
                {" "}
                {product.stock === 0 ? "Out of stock" : "In stock"}
              </span>
            </p>
          </div>

          <div className="fk-services">
            <span>✔ 7-day Replacement</span>
            <span>✔ Free Delivery</span>
            <span>✔ Warranty Included</span>
          </div>
        </section>
      </div>
    </>
  );
}
