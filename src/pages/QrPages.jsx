import { useEffect, useState, useMemo } from "react";
import CouponCard from "../components/CouponCard";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api";

export default function QrPages() {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");     // <-- SEARCH STATE
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Extract backend base URL (without /api)
  const backend = useMemo(() => {
    return (import.meta.env.VITE_API_BASE || "http://localhost:5000")
      .replace("/api", "");
  }, []);

  useEffect(() => {
    API.get("/coupons/templates")
      .then((res) => {
        setTemplates(res.data.templates || []);
        setLoading(false);
      })
      .catch(() => {
        setErrorMsg("Failed to load templates");
        setLoading(false);
      });
  }, []);

  // -------------------------------------------------
  // SEARCH FILTERING (FAST, CLEAN, NO EXTRA API)
  // -------------------------------------------------
  const filteredTemplates = useMemo(() => {
    const q = search.toLowerCase();

    return templates.filter((t) => {
      return (
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.templateCode?.toLowerCase().includes(q) ||
        t.expiryDate?.toLowerCase().includes(q)
      );
    });
  }, [templates, search]);
  // -------------------------------------------------

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-white text-lg font-medium">Loading templates...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-red-400 text-lg font-medium">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black drop-shadow-lg">
          Coupon Templates
        </h1>

        <button
          className="bg-linear-to-r from-teal-500 to-cyan-500 text-black px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
          onClick={() => navigate("/addCoupon")}
        >
          + Add Coupon Template
        </button>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search templates... (title, description, code)"
        className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-teal-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((coupon) => (
            <CouponCard
              key={coupon._id}
              coupon={{
                ...coupon,
                qrImagePath:
                  coupon.qrImagePath ? coupon.qrImagePath : null,
              }}
              onClick={() => navigate(`/viewCoupon/${coupon._id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 mt-10 text-center text-lg">
          No matching templates found.
        </div>
      )}
    </div>
  );
}
