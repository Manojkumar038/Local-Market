import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, backendUrl]);

  if (loading) return <div className="p-6 text-center">Loading product…</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!product) return <div className="p-6 text-center">Product not found</div>;

  const thumbs = [product.coverPhoto, ...(product.images || [])].filter(
    Boolean
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* ================= LEFT: GALLERY ================= */}
            <section className="md:sticky md:top-24 h-fit">
              {/* MAIN IMAGE (LOCKED RATIO) */}
              <div className="bg-white rounded-xl p-2">
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden max-w-md mx-auto">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
              </div>

              {/* THUMBNAILS */}
              {thumbs.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto">
                  {thumbs.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImage(img)}
                      className={`flex-shrink-0 w-16 h-16 border rounded-lg overflow-hidden ${
                        img === mainImage ? "border-black" : "border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt="thumb"
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* DESKTOP ACTIONS */}
              <div className="hidden md:flex gap-4 mt-6">
                <button className="flex-1 py-3 rounded-lg bg-black text-white font-medium">
                  Add to Cart
                </button>
                <button
                  disabled={product.stock === 0}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    product.stock === 0
                      ? "bg-gray-300 text-gray-600"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </section>

            {/* ================= RIGHT: CONTENT ================= */}
            <section className="bg-white rounded-xl p-6 space-y-5">
              <h1 className="text-2xl font-semibold">{product.name}</h1>

              {/* PRICE */}
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  Extra ₹1000 off
                </span>
              </div>

              {/* STOCK */}
              <p
                className={`text-sm font-medium ${
                  product.stock === 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {product.stock === 0 ? "Out of Stock" : "In Stock"}
              </p>

              {/* DESCRIPTION */}
              <p className="text-gray-700 text-sm leading-relaxed">
                {product.description}
              </p>

              {/* HIGHLIGHTS */}
              {product.highlights?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Highlights</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {product.highlights.map((h) => (
                      <li key={h._id}>{h.detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SERVICES */}
              <div className="border-t pt-4 grid grid-cols-2 gap-3 text-sm">
                <span>✔ 7-day Replacement</span>
                <span>✔ Free Delivery</span>
                <span>✔ Warranty Included</span>
                <span>✔ Secure Payments</span>
              </div>
            </section>
          </div>
        </div>

        {/* ================= MOBILE STICKY ACTION BAR ================= */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex gap-3">
          <button className="flex-1 py-3 rounded-lg bg-black text-white font-medium">
            Add to Cart
          </button>
          <button
            disabled={product.stock === 0}
            className={`flex-1 py-3 rounded-lg font-medium ${
              product.stock === 0
                ? "bg-gray-300 text-gray-600"
                : "bg-orange-500 text-white"
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </>
  );
}
