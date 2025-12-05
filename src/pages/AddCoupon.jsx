import { useState, useEffect } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import CouponPreview from "../components/CouponPreview";

export default function AddCoupon() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [validDays, setValidDays] = useState("");
  const [badgeStyle, setBadgeStyle] = useState("");
 const [footerText,setFooterText]=useState("")
  const [shopId, setShopId] = useState("");
  const [selectedShop, setSelectedShop] = useState(null);
  const [shops, setShops] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/shops/all")
      .then((res) => setShops(res.data.shops || []))
      .catch(() => setErrorMsg("Failed to load shops."));
  }, []);

  const handleSelectShop = (e) => {
    const id = e.target.value;
    setShopId(id);

    const shop = shops.find((s) => s._id === id);
    setSelectedShop(shop || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shopId) return setErrorMsg("Please select a shop.");
    if (!validDays) return setErrorMsg("Please enter valid days.");

    setLoading(true);
    setErrorMsg("");

    try {
      // await API.post("/coupons/create-template", {
      //   title,
      //   description,
      //   expiryDate,
      //   validDays,
      //   badgeStyle,
      //   shopId,
      // });
      await API.post("/coupons/create-template", {
        title,
        description,
        expiryDate,
        validDays,
        badgeStyle,
        footerText,
        shopId,
      });

      navigate("/qrpages");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to create coupon!";
      setErrorMsg(msg);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white drop-shadow-lg">
        Create Coupon Template
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: FORM */}
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-xl w-full">
          {errorMsg && (
            <p className="text-red-600 mb-4 font-medium">{errorMsg}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Shop */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Select Shop
              </label>

              <select
                value={shopId}
                onChange={handleSelectShop}
                className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">-- Choose Shop --</option>
                {shops.map((shop) => (
                  <option key={shop._id} value={shop._id}>
                    {shop.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Coupon Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-teal-500"
                placeholder="Ex: Diwali Mega Offer"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Description
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-teal-500 resize-none"
                placeholder="Enter offer details..."
                required
              ></textarea>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            {/* Valid Days */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Valid Days
              </label>
              <input
                type="number"
                value={validDays}
                onChange={(e) => setValidDays(e.target.value)}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-teal-500"
                placeholder="Ex: 7"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Footer Text
              </label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="#SeeYouThere"
                className="w-full p-4 border rounded-xl"
              />
            </div>

            {/* Badge */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Badge Style (optional)
              </label>
              <select
                value={badgeStyle}
                onChange={(e) => setBadgeStyle(e.target.value)}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-teal-500"
              >
                <option value="">None</option>
                <option value="HolidaySpecial">Holiday Special</option>
                <option value="MegaSale">Mega Sale</option>
                <option value="LimitedOffer">Limited Offer</option>
                <option value="FlashDeal">Flash Deal</option>
                <option value="WinterFest">Winter Fest</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 
                         text-white py-4 rounded-xl hover:shadow-lg transition-all 
                         duration-300 font-medium text-lg"
            >
              {loading ? "Creating..." : "Create Template"}
            </button>
          </form>
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div className="flex justify-center items-start">
          <CouponPreview
            shop={selectedShop}
            title={title}
            description={description}
            expiryDate={expiryDate}
            validDays={validDays}
            badgeStyle={badgeStyle}
            footerText={footerText}
          />
        </div>
      </div>
    </div>
  );
}
