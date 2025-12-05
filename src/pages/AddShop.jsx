import { useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AddShop() {
  // FORM STATES
  const [name, setName] = useState("");
  const [owner, setOwnerName] = useState("");
  const [mob, setMob] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [logo, setLogo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // prepare formdata
      const formData = new FormData();
      formData.append("name", name);
      formData.append("owner", owner);
      formData.append("mob", mob);
      formData.append("address", address);
      formData.append("category", category);

      if (logo) formData.append("logo", logo);

      const res = await API.post("/shops/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/shops");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to add shop!";
      setErrorMsg(msg);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-dark drop-shadow-lg">Add Shop</h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {errorMsg && (
            <p className="text-red-600 text-center font-medium">{errorMsg}</p>
          )}

          {/* Shop Name */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Shop Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-4 border rounded-xl"
            />
          </div>

          {/* Owner */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Owner Name
            </label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              className="w-full p-4 border rounded-xl"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={mob}
              onChange={(e) => setMob(e.target.value)}
              required
              className="w-full p-4 border rounded-xl"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Eg: Grocery, Clothing, Electronics..."
              className="w-full p-4 border rounded-xl"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Address</label>
            <textarea
              rows="4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full p-4 border rounded-xl"
            ></textarea>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Shop Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
              className="w-full p-3 border rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-4 rounded-xl"
          >
            {loading ? "Adding..." : "Add Shop"}
          </button>
        </form>
      </div>
    </div>
  );
}
