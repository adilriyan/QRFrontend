import { useEffect, useState } from "react";
import ShopCard from "../components/ShopCard";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api";

export default function Shops() {
  const navigate = useNavigate();

  // SHOPS STATE
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // ----------------------------------------
  // FETCH SHOPS FROM BACKEND
  // ----------------------------------------
  useEffect(() => {
   

    fetchShops();
  }, []);
 const fetchShops = async () => {
      try {
        const res = await API.get("/shops/all");

        setShops(res.data.shops || []);
      } catch (err) {
        console.error(err);
        const msg = err?.response?.data?.error || "Failed to load shops.";
        setErrorMsg(msg);
      }
      setLoading(false);
    };
    console.log(shops);
    
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black drop-shadow-lg">Shops</h1>

        <button
          className="bg-linear-to-r from-teal-500 to-cyan-500 text-dark px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
          onClick={() => navigate("/addShop")}
        >
          + Add Shop
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {errorMsg && <p className="text-red-600 font-medium">{errorMsg}</p>}

      {/* LOADING STATE */}
      {loading && <p className="text-gray-600">Loading shops...</p>}

      {/* NO SHOPS */}
      {!loading && shops.length === 0 && (
        <p className="text-gray-600">No shops found.</p>
      )}

      {/* SHOPS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <ShopCard key={shop._id} shop={shop} onRefresh={fetchShops} />
        ))}
      </div>
    </div>
  );
}
