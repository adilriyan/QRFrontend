import { useState, useMemo } from "react";
import { FaEdit, FaTrash, FaChartBar } from "react-icons/fa";
import { IoCallSharp } from "react-icons/io5";
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
    return (import.meta.env.VITE_API_BASE || "http://localhost:5000")
      .replace("/api", "");
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
      {/* MODERN SHOP CARD */}
      <div className="group bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 p-6 relative overflow-hidden">

        {/* Decorative Gradient Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-100/40 to-cyan-100/40 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

        {/* LOGO */}
        <div className="flex justify-center mb-4 relative">
          <img
            src={
              shop.logo
                ? `${backend}${shop.logo}`
                : "https://via.placeholder.com/150?text=No+Logo"
            }
            alt={shop.name}
            className="w-24 h-24 rounded-2xl object-cover shadow-lg border border-gray-200"
          />
        </div>

        {/* NAME + ADDRESS */}
        <h2 className="text-xl font-bold text-gray-800 text-center tracking-tight">
          {shop.name}
        </h2>

        <p className="text-gray-500 text-sm text-center">{shop.address}</p>

        {/* OWNER / PHONE / CATEGORY */}
        <div className="mt-3 text-center space-y-1">
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Owner:</span> {shop.owner}
          </p>

          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Mob:</span> {shop.mob}
          </p>

          {shop.category && (
            <p className="text-gray-600 text-sm">
              <span className="font-semibold">Category:</span> {shop.category}
            </p>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 mt-5">
          <div className="rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 p-4 text-center border border-teal-200">
            <p className="text-2xl font-extrabold text-teal-700">{shop.totalCoupons}</p>
            <p className="text-gray-700 text-sm font-medium">Coupons</p>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-4 text-center border border-orange-200">
            <p className="text-2xl font-extrabold text-orange-700">{shop.totalScans}</p>
            <p className="text-gray-700 text-sm font-medium">Scans</p>
          </div>
        </div>

        {/* MODERN ACTION BAR */}
        <div className="flex justify-between items-center mt-6 bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-inner">
          <button
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-all text-sm shadow-md"
            onClick={() => navigate(`/analytics/${shop._id}`)}
          >
            <FaChartBar /> Analytics
          </button>

          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all text-sm shadow-md"
            onClick={() => setEditOpen(true)}
          >
            <FaEdit /> Edit
          </button>

          <button
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all text-sm shadow-md"
            onClick={() => setDeleteOpen(true)}
          >
            <FaTrash /> Delete
          </button>
        </div>

      </div>

      {/* EDIT MODAL */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl w-96 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Edit Shop</h2>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium">Shop Name</label>
                <input
                  type="text"
                  value={editData.name}
                  className="w-full p-3 border rounded-xl"
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Owner Name</label>
                <input
                  type="text"
                  value={editData.owner}
                  className="w-full p-3 border rounded-xl"
                  onChange={(e) => setEditData({ ...editData, owner: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="text"
                  value={editData.mob}
                  className="w-full p-3 border rounded-xl"
                  onChange={(e) => setEditData({ ...editData, mob: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>
                <input
                  type="text"
                  value={editData.category}
                  className="w-full p-3 border rounded-xl"
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Address</label>
                <input
                  type="text"
                  value={editData.address}
                  className="w-full p-3 border rounded-xl"
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-xl"
                  onClick={() => setEditOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl w-80 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Delete Shop?</h2>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-xl"
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded-xl"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
