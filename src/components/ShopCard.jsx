import { useState, useMemo } from "react";
import { FaEdit, FaTrash, FaChartBar, FaPhone,FaUser  } from "react-icons/fa";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function ShopCard({ shop, onRefresh }) {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editData, setEditData] = useState({
    name: shop.name || "",
    address: shop.address || "",
    owner: shop.owner || "",
    mob: shop.mob || "",
    category: shop.category || "",
  });

  const backend = useMemo(() => {
    return (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace("/api", "");
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/shops/update/${shop._id}`, editData);
      setEditOpen(false);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to update shop!");
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/shops/delete/${shop._id}`);
      setDeleteOpen(false);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete shop!");
    }
  };

  return (
    <>
     
      <div className="
        group relative bg-slate-900/80 backdrop-blur-xl border border-slate-800/80
        rounded-3xl shadow-2xl shadow-slate-950/50 hover:shadow-teal-500/30
        hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500
        overflow-hidden cursor-pointer
      ">
     
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-teal-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    
        <div className="relative z-10 p-6 pt-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={shop.logo || "https://via.placeholder.com/120x120/64748b/ffffff?text=No+Logo"}
                alt={shop.name}
                className="
                  w-24 h-24 md:w-28 md:h-28 object-cover rounded-3xl
                  border-4 border-white/20 shadow-2xl shadow-black/20
                  group-hover:border-teal-400/80 group-hover:shadow-teal-500/40
                  transition-all duration-300
                "
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/50">
                <FaChartBar className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>


          <h3 className="text-xl md:text-2xl font-black text-slate-100 text-center tracking-tight mb-2 px-4">
            {shop.name}
          </h3>

 
          <p className="text-slate-400 text-sm text-center leading-relaxed px-4 mb-6">
            {shop.address || "Address not set"}
          </p>

 
          <div className="space-y-2 mb-6 px-4">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
              <FaUser className="text-emerald-400 w-4 h-4" />
              <span>{shop.owner || "Owner not set"}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
              <FaPhone className="text-blue-400 w-4 h-4" />
              <span>{shop.mob || "Phone not set"}</span>
            </div>
            {shop.category && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>{shop.category}</span>
              </div>
            )}
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4 px-4 pb-6 relative z-10">
            <div className="
              bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-4
              text-center hover:bg-teal-500/20 hover:border-teal-500/50 transition-all
            ">
              <p className="text-2xl font-black text-slate-100 mb-1">
                {shop.totalCoupons || 0}
              </p>
              <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">
                Coupons
              </p>
            </div>
            <div className="
              bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-4
              text-center hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all
            ">
              <p className="text-2xl font-black text-slate-100 mb-1">
                {shop.totalScans || 0}
              </p>
              <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">
                Scans
              </p>
            </div>
          </div>


          <div className="bg-slate-800/90 backdrop-blur-sm border-t border-slate-700/50 p-4 px-6 relative z-10">
            <div className="flex items-center justify-between">
              <button
                className="
                  flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600
                  text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:shadow-purple-500/40
                  transition-all duration-300 text-sm font-semibold shadow-lg
                "
                onClick={() => navigate(`/analytics/${shop._id}`)}
              >
                <FaChartBar />
                Analytics
              </button>
              <div className="flex items-center gap-2">
                <button
                  className="
                    p-2.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-600/50
                    text-blue-300 hover:text-blue-100 rounded-xl hover:scale-110
                    transition-all duration-300 shadow-md hover:shadow-blue-500/30
                  "
                  onClick={() => setEditOpen(true)}
                  title="Edit Shop"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  className="
                    p-2.5 bg-red-600/20 hover:bg-red-600/40 border border-red-600/50
                    text-red-300 hover:text-red-100 rounded-xl hover:scale-110
                    transition-all duration-300 shadow-md hover:shadow-red-500/30
                  "
                  onClick={() => setDeleteOpen(true)}
                  title="Delete Shop"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

    
        {editOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-slate-950/50 w-full max-w-md p-8">
              <h2 className="text-2xl font-black text-slate-100 mb-6 flex items-center gap-3">
                <FaEdit className="text-blue-400" />
                Edit Shop
              </h2>
              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Shop Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-slate-100 focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Owner</label>
                  <input
                    type="text"
                    value={editData.owner}
                    onChange={(e) => setEditData({ ...editData, owner: e.target.value })}
                    className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-slate-100 focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editData.mob}
                    onChange={(e) => setEditData({ ...editData, mob: e.target.value })}
                    className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-slate-100 focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-2">Category</label>
                    <input
                      type="text"
                      value={editData.category}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                      className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-slate-100 focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-2">Address</label>
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-slate-100 focus:ring-2 focus:ring-blue-500/50"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t border-slate-700/50">
                  <button
                    type="button"
                    className="
                      px-6 py-3 bg-slate-700/50 border border-slate-700 text-slate-300
                      rounded-2xl hover:bg-slate-700 hover:text-slate-100 transition-all
                    "
                    onClick={() => setEditOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="
                      px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                      rounded-2xl shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60
                      hover:scale-105 transition-all font-semibold
                    "
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

    
        {deleteOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-slate-950/50 w-full max-w-sm p-8">
              <div className="w-20 h-20 bg-red-500/20 border-4 border-red-500/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FaTrash className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-100 text-center mb-4">
                Delete Shop?
              </h3>
              <p className="text-slate-400 text-center mb-8 leading-relaxed">
                This will permanently remove <strong>"{shop.name}"</strong> and all associated coupons.
                <br />This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="
                    px-6 py-3 bg-slate-700/50 border border-slate-700 text-slate-300
                    rounded-2xl hover:bg-slate-700 hover:text-slate-100 transition-all flex-1
                  "
                  onClick={() => setDeleteOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="
                    px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white
                    rounded-2xl shadow-lg shadow-red-500/40 hover:shadow-red-500/60
                    hover:scale-105 transition-all font-semibold flex-1
                  "
                  onClick={handleDelete}
                >
                  Delete Shop
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
