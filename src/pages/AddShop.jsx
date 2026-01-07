import { useState } from "react";
import { FaImage, FaUpload, FaStore, FaUser, FaPhone, FaMapMarkerAlt, FaTag  } from "react-icons/fa";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AddShop() {

  const [name, setName] = useState("");
  const [owner, setOwnerName] = useState("");
  const [mob, setMob] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();


  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
            Add New Shop
          </h1>
          <p className="text-slate-400 mt-2 text-sm uppercase tracking-[0.18em]">
            Complete the details below to register your shop
          </p>
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-slate-950/50 p-8 lg:p-10 max-w-2xl mx-auto">
        
        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500/40 backdrop-blur-sm rounded-2xl p-5 mb-8">
            <p className="text-red-300 font-medium text-center">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div>
              <label className="flex items-center gap-2 text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                <FaStore className="text-teal-400" />
                Shop Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="
                  w-full p-5 pl-12 bg-slate-800/50 border border-slate-700/80
                  rounded-2xl backdrop-blur-sm text-slate-100 placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80
                  transition-all duration-200 shadow-md hover:shadow-teal-500/20
                "
                placeholder="Ex: Fresh Mart Supermarket"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                <FaUser className="text-emerald-400" />
                Owner Name
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                className="
                  w-full p-5 pl-12 bg-slate-800/50 border border-slate-700/80
                  rounded-2xl backdrop-blur-sm text-slate-100 placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80
                  transition-all duration-200 shadow-md hover:shadow-emerald-500/20
                "
                placeholder="Ex: Rajesh Kumar"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                <FaPhone className="text-blue-400" />
                Phone Number
              </label>
              <input
                type="tel"
                value={mob}
                onChange={(e) => setMob(e.target.value)}
                required
                className="
                  w-full p-5 pl-12 bg-slate-800/50 border border-slate-700/80
                  rounded-2xl backdrop-blur-sm text-slate-100 placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80
                  transition-all duration-200 shadow-md hover:shadow-blue-500/20
                "
                placeholder="Ex: +91 98765 43210"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                <FaTag className="text-purple-400" />
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="
                  w-full p-5 pl-12 bg-slate-800/50 border border-slate-700/80
                  rounded-2xl backdrop-blur-sm text-slate-100 placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80
                  transition-all duration-200 shadow-md hover:shadow-purple-500/20
                "
                placeholder="Ex: Grocery, Clothing, Electronics..."
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
              <FaMapMarkerAlt className="text-orange-400" />
              Full Address
            </label>
            <textarea
              rows="4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="
                w-full p-5 pl-12 bg-slate-800/50 border border-slate-700/80
                rounded-2xl backdrop-blur-sm text-slate-100 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80
                resize-vertical transition-all duration-200 shadow-md hover:shadow-orange-500/20
              "
              placeholder="Ex: 123 Main Street, Malappuram, Kerala 676505"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-slate-300 font-semibold mb-4 text-sm uppercase tracking-wide">
              <FaImage className="text-indigo-400" />
              Shop Logo (Optional)
            </label>
            
       
            <div className="group">
              <label 
                htmlFor="logo-upload"
                className="
                  flex flex-col items-center justify-center w-full h-48
                  border-2 border-dashed border-slate-700/60 rounded-3xl
                  bg-slate-800/30 backdrop-blur-sm cursor-pointer
                  hover:border-teal-500/80 hover:bg-teal-500/5
                  hover:shadow-teal-500/20 hover:scale-[1.02]
                  transition-all duration-300 group-hover:shadow-2xl
                "
              >
                {logoPreview ? (
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <img 
                      src={logoPreview} 
                      alt="Logo Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <button
                      type="button"
                      onClick={() => {
                        setLogo(null);
                        setLogoPreview(null);
                        document.getElementById('logo-upload').value = '';
                      }}
                      className="
                        absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 text-white
                        w-8 h-8 rounded-full flex items-center justify-center text-xs
                        backdrop-blur-sm shadow-lg hover:scale-110 transition-all
                      "
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-3 p-8">
                    <FaUpload className="w-12 h-12 text-slate-400 mx-auto group-hover:text-teal-400 transition-colors" />
                    <div>
                      <p className="text-slate-300 font-semibold text-lg mb-1">
                        Drop your logo here
                      </p>
                      <p className="text-slate-500 text-sm">
                        PNG, JPG up to 2MB (Recommended: 400x400px)
                      </p>
                    </div>
                  </div>
                )}
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full h-14 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500
              text-slate-950 font-black rounded-3xl shadow-xl shadow-teal-500/40
              hover:from-teal-600 hover:to-emerald-600 hover:shadow-teal-500/60 hover:scale-[1.02]
              disabled:from-slate-700/50 disabled:to-slate-800/50 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100
              transition-all duration-300 flex items-center justify-center gap-3 text-xl shadow-2xl
            "
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                Adding Shop...
              </>
            ) : (
              <>
                <FaStore className="w-5 h-5" />
                Create Shop
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
