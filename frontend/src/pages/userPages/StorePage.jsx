import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Banner from "../../assets/banner.png";

export default function StorePage() {
  const { id } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/get-store-info`, {
          params: { id },
        });
        setStore(res.data.store);
        setProducts(res.data.products || []);
      } catch {
        setError("Failed to load store");
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [id, backendUrl]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  if (loading) return <div className="p-6 text-center">Loading…</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!store) return <div className="p-6 text-center">Store not found</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* ================= MOBILE HERO ================= */}
      <div
        className="md:hidden h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${store.banner || Banner})` }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-end">
          <div className="p-4 text-white">
            <p className="text-xs opacity-80">
              Products · {filteredProducts.length} items
            </p>
            <h1 className="text-xl font-semibold">{store.name}</h1>
            <p className="text-sm opacity-90">{store.description}</p>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* ===== LEFT PANEL (DESKTOP STORE INFO) ===== */}
          <aside className="hidden md:block bg-white rounded-xl p-6 h-fit sticky top-6">
            <img
              src={store.banner || Banner}
              alt={store.name}
              className="w-full aspect-[4/3] object-cover rounded-lg mb-4"
            />

            <p className="text-xs text-gray-500 mb-1">
              Products · {filteredProducts.length}
            </p>
            <h1 className="text-2xl font-semibold mb-2">{store.name}</h1>
            <p className="text-sm text-gray-600">{store.description}</p>
          </aside>

          {/* ===== RIGHT PANEL (PRODUCTS) ===== */}
          <section>
            {/* SEARCH */}
            <div className="p-4 rounded-xl flex gap-3 mb-6">
              <input
                className="flex-1 border rounded-lg px-4 py-2 text-sm"
                placeholder="Search in this store…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                Filters
              </button>
            </div>

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Products</h2>
              <span className="text-sm text-gray-500">
                {filteredProducts.length} items
              </span>
            </div>

            {/* GRID */}
            {filteredProducts.length === 0 ? (
              <p className="text-center text-gray-500">No products found</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => navigate(`/product/${p._id}`)}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                  >
                    {/* IMAGE (FIXED RATIO) */}
                    <div className="w-full aspect-square bg-gray-50">
                      <img
                        src={p.coverPhoto || p.images?.[0]}
                        alt={p.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* INFO */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-medium line-clamp-2">
                        {p.name}
                      </h3>
                      <p className="font-semibold">₹{p.price}</p>

                      <button
                        disabled={p.stock === 0}
                        className={`w-full text-sm py-2 rounded-lg ${
                          p.stock === 0
                            ? "bg-gray-300 text-gray-600"
                            : "bg-black text-white"
                        }`}
                      >
                        {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ================= FOOTER (STICKS BOTTOM) ================= */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-500 bg-white">
        About · Privacy · Terms · Contact <span></span>© 2025 Local Market
      </footer>
    </div>
  );
}
