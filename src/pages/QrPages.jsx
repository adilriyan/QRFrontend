import { useEffect, useState, useMemo } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api";
import CouponCard from "../components/CouponCard";

export default function QrPages() {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");


  const backend = useMemo(() => {
    return (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace("/api", "");
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

 
  const SkeletonCard = () => (
    <div className="
      bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 
      rounded-3xl shadow-2xl shadow-slate-950/50 p-8 animate-pulse
      hover:shadow-teal-500/30 hover:border-teal-500/50 transition-all
    ">
      <div className="w-32 h-32 bg-slate-800/50 rounded-2xl mx-auto mb-6"></div>
      <div className="h-8 bg-slate-800/50 rounded-2xl w-4/5 mx-auto mb-4"></div>
      <div className="h-5 bg-slate-800/30 rounded-xl w-3/4 mx-auto mb-6"></div>
      <div className="h-10 bg-slate-800/50 rounded-2xl mx-auto w-full"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen p-8 space-y-12">
      
        <div className="flex items-center justify-between">
          <div className="h-14 bg-slate-800/50 rounded-3xl w-80 animate-pulse"></div>
          <div className="h-12 bg-slate-800/50 rounded-3xl w-56 animate-pulse"></div>
        </div>


        <div className="h-14 bg-slate-800/50 rounded-3xl max-w-2xl mx-auto animate-pulse"></div>

 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center space-y-6">
        <div className="w-28 h-28 bg-red-500/20 border-4 border-red-500/50 rounded-3xl flex items-center justify-center">
          <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-slate-100">Failed to Load</h2>
        <p className="text-slate-400 text-lg text-center max-w-md">{errorMsg}</p>
        <button
          className="
            bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black 
            px-10 py-4 rounded-3xl shadow-xl shadow-teal-500/40 hover:shadow-teal-500/60
            hover:scale-105 transition-all duration-300
          "
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 lg:px-12 lg:pb-12 space-y-12">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-100 via-teal-100 to-emerald-100 bg-clip-text text-transparent drop-shadow-2xl">
            Coupon Templates
          </h1>
          <p className="text-slate-400 mt-3 text-lg lg:text-xl max-w-2xl leading-relaxed">
            Manage and generate QR coupons for all your shops
          </p>
        </div>
        <button
          className="
            group flex items-center gap-3 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500
            text-slate-950 font-black px-10 py-5 rounded-3xl shadow-xl shadow-teal-500/40
            hover:from-teal-600 hover:to-emerald-600 hover:shadow-teal-500/60 hover:scale-105
            transition-all duration-300 whitespace-nowrap
          "
          onClick={() => navigate("/addCoupon")}
        >
          <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
          Create New Template
        </button>
      </div>


      <div className="max-w-2xl mx-auto">
        <div className="relative group">
          <FaSearch className="
            absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 
            group-focus-within:text-teal-400 transition-colors w-5 h-5
          " />
          <input
            type="text"
            placeholder="Search by title, description, code, or expiry..."
            className="
              w-full pl-14 pr-6 py-5 bg-slate-900/80 border border-slate-800/80
              rounded-3xl backdrop-blur-xl text-slate-200 placeholder-slate-500
              focus:outline-none focus:ring-3 focus:ring-teal-500/40 focus:border-teal-500/60
              shadow-2xl hover:shadow-teal-500/20 hover:border-teal-500/50
              transition-all duration-300 text-lg
            "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-800/50 rounded-xl transition-all"
              onClick={() => setSearch("")}
            >
              <svg className="w-5 h-5 text-slate-400 hover:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-slate-500 text-sm mt-2 text-center">
          Showing {filteredTemplates.length} of {templates.length} templates
        </p>
      </div>


      {filteredTemplates.length > 0 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}>
          {filteredTemplates.map((coupon) => (
            <CouponCard
              key={coupon._id}
              coupon={{
                ...coupon,
                qrImagePath: coupon.qrImagePath ? coupon.qrImagePath : null,
              }}
              backendBase={backend}
              onClick={() => navigate(`/viewCoupon/${coupon._id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-6 pt-20">
          <div className="w-32 h-32 bg-slate-800/50 border-4 border-dashed border-slate-700/50 rounded-3xl flex items-center justify-center">
            <svg className="w-16 h-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-slate-100">
            {search ? "No Matching Templates" : "No Templates Yet"}
          </h3>
          <p className="text-slate-400 text-xl text-center max-w-md leading-relaxed">
            {search 
              ? "Try adjusting your search terms for better results."
              : "Get started by creating your first coupon template."
            }
          </p>
          {!search && (
            <button
              className="
                bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black 
                px-12 py-5 rounded-3xl shadow-xl shadow-teal-500/40 hover:shadow-teal-500/60
                hover:scale-105 transition-all duration-300 text-lg
              "
              onClick={() => navigate("/addCoupon")}
            >
              Create First Template
            </button>
          )}
        </div>
      )}
    </div>
  );
}
