import { useEffect, useState } from "react";
import { FaPlus,FaUser  } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api";
import ShopCard from "../components/ShopCard";

export default function Shops() {
  const navigate = useNavigate();

  // SHOPS STATE
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // FETCH SHOPS
  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await API.get("/shops/all");
      setShops(res.data.shops || []);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || "Failed to load shops.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // Skeleton cards for loading
  const SkeletonCard = () => (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-slate-950/50 p-8 animate-pulse">
      <div className="w-24 h-24 bg-slate-800/50 rounded-2xl mx-auto mb-6"></div>
      <div className="h-8 bg-slate-800/50 rounded-xl w-3/4 mx-auto mb-4"></div>
      <div className="h-4 bg-slate-800/30 rounded-lg w-full mb-6"></div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="h-20 bg-slate-800/50 rounded-2xl"></div>
        <div className="h-20 bg-slate-800/50 rounded-2xl"></div>
      </div>
      <div className="h-12 bg-slate-800/50 rounded-2xl"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
            Shops
          </h1>
          <p className="text-slate-400 mt-1 text-sm uppercase tracking-[0.18em]">
            Manage your registered merchant locations
          </p>
        </div>
        <button
          className="
            group flex items-center gap-3 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500
            text-slate-950 font-black px-8 py-4 rounded-3xl shadow-xl shadow-teal-500/40
            hover:from-teal-600 hover:to-emerald-600 hover:shadow-teal-500/60 hover:scale-105
            transition-all duration-300
          "
          onClick={() => navigate("/addShop")}
        >
          <FaPlus className="group-hover:rotate-90 transition-transform" />
          Add Shop
        </button>
      </div>

      {/* ERROR */}
      {errorMsg && (
        <div className="bg-red-500/20 border border-red-500/40 backdrop-blur-sm rounded-3xl p-6 max-w-2xl mx-auto">
          <p className="text-red-300 font-semibold text-center">{errorMsg}</p>
        </div>
      )}

      {/* LOADING SKELETONS */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && shops.length === 0 && !errorMsg && (
        <div className="text-center py-24">
          <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M17 4h5m0 0h-5m5 0v5m0 0v5m0-5h5m-5 0H2" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-slate-200 mb-2">No Shops Yet</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Get started by adding your first shop location to begin creating QR coupons.
          </p>
          <button
            className="
              bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black 
              px-8 py-4 rounded-3xl shadow-xl shadow-teal-500/40 hover:shadow-teal-500/60
              hover:scale-105 transition-all duration-300
            "
            onClick={() => navigate("/addShop")}
          >
            + Add First Shop
          </button>
        </div>
      )}

      {/* SHOPS GRID */}
      {!loading && shops.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shops.map((shop) => (
            <ShopCard key={shop._id} shop={shop} onRefresh={fetchShops} />
          ))}
        </div>
      )}
    </div>
  );
}
