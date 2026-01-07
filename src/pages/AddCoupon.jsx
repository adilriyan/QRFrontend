import { useState, useEffect } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import CouponPreview from "../components/CouponPreview";
import { COUPON_THEMES } from "../constants/couponThemes";

export default function AddCoupon() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [validDays, setValidDays] = useState("");
  const [badgeStyle, setBadgeStyle] = useState("");
  const [footerText, setFooterText] = useState("");
  const [shopId, setShopId] = useState("");
  const [selectedShop, setSelectedShop] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [theme, setTheme] = useState(COUPON_THEMES[0]);
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
      await API.post("/coupons/create-template", {
        title,
        description,
        expiryDate,
        validDays,
        badgeStyle,
        footerText,
        shopId,
        theme,
      });
      navigate("/qrpages");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to create coupon!";
      setErrorMsg(msg);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
            Create Coupon
          </h1>
          <p className="text-slate-400 mt-2 text-sm uppercase tracking-[0.18em]">
            Design beautiful QR coupons for your shops
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* LEFT: FORM */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-slate-950/50 p-8 xl:p-10">
          
          {errorMsg && (
            <div className="bg-red-500/20 border border-red-500/40 backdrop-blur-sm rounded-2xl p-5 mb-8">
              <p className="text-red-300 font-medium">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Shop Select */}
            <div>
              <label className="block text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                Select Shop
              </label>
              <div className="relative">
                <select
                  value={shopId}
                  onChange={handleSelectShop}
                  className="
                    w-full p-5 pr-12 bg-slate-800/50 border border-slate-700/80
                    rounded-2xl backdrop-blur-sm text-slate-100
                    focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80
                    transition-all duration-200 appearance-none
                  "
                  required
                >
                  <option value="">Choose a shop...</option>
                  {shops.map((shop) => (
                    <option key={shop._id} value={shop._id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                Coupon Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="
                  w-full p-5 bg-slate-800/50 border border-slate-700/80
                  rounded-2xl backdrop-blur-sm text-slate-100 placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80
                  transition-all duration-200
                "
                placeholder="Ex: Diwali Mega Offer"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                Description
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="
                  w-full p-5 bg-slate-800/50 border border-slate-700/80
                  rounded-2xl backdrop-blur-sm text-slate-100 placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80
                  resize-vertical transition-all duration-200
                "
                placeholder="Enter offer details and terms..."
                required
              />
            </div>

            {/* Date & Days Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="
                    w-full p-5 bg-slate-800/50 border border-slate-700/80
                    rounded-2xl backdrop-blur-sm text-slate-100
                    focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80
                    transition-all duration-200
                  "
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                  Valid Days
                </label>
                <input
                  type="number"
                  min="1"
                  value={validDays}
                  onChange={(e) => setValidDays(e.target.value)}
                  className="
                    w-full p-5 bg-slate-800/50 border border-slate-700/80
                    rounded-2xl backdrop-blur-sm text-slate-100 placeholder-slate-500
                    focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80
                    transition-all duration-200
                  "
                  placeholder="Ex: 7"
                  required
                />
              </div>
            </div>

            {/* Footer Text & Badge Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                  Footer Text
                </label>
                <input
                  type="text"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className="
                    w-full p-5 bg-slate-800/50 border border-slate-700/80
                    rounded-2xl backdrop-blur-sm text-slate-100 placeholder-slate-500
                    focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80
                    transition-all duration-200
                  "
                  placeholder="#SeeYouThere"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                  Badge Style
                </label>
                <select
                  value={badgeStyle}
                  onChange={(e) => setBadgeStyle(e.target.value)}
                  className="
                    w-full p-5 pr-12 bg-slate-800/50 border border-slate-700/80
                    rounded-2xl backdrop-blur-sm text-slate-100
                    focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80
                    transition-all duration-200 appearance-none
                  "
                >
                  <option value="">None</option>
                  <option value="HolidaySpecial">Holiday Special</option>
                  <option value="MegaSale">Mega Sale</option>
                  <option value="LimitedOffer">Limited Offer</option>
                  <option value="FlashDeal">Flash Deal</option>
                  <option value="WinterFest">Winter Fest</option>
                  <option value="Onam">Onam</option>
                  <option value="NewYear">New Year</option>
                </select>
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-slate-300 font-semibold mb-5 text-sm uppercase tracking-wide">
                Coupon Theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {COUPON_THEMES.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTheme(t)}
                    className={`
                      group rounded-2xl border-2 overflow-hidden shadow-lg shadow-slate-950/50
                      hover:scale-105 hover:shadow-teal-500/30 transition-all duration-300
                      ${theme.id === t.id 
                        ? 'border-teal-500 ring-2 ring-teal-500/50 scale-105 shadow-teal-500/50' 
                        : 'border-slate-700/50 hover:border-teal-500/50'
                      }
                    `}
                  >
                    <div
                      className="h-20 flex items-center justify-center text-sm font-bold px-2"
                      style={{ backgroundColor: t.primary, color: t.text }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="h-8"
                      style={{ backgroundColor: t.footer }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full h-14 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500
                text-slate-950 font-bold rounded-2xl shadow-xl shadow-teal-500/40
                hover:from-teal-600 hover:to-emerald-600 hover:shadow-teal-500/60 hover:scale-[1.02]
                disabled:from-slate-700/50 disabled:to-slate-800/50 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100
                transition-all duration-300 flex items-center justify-center gap-2 text-lg
              "
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                  Creating Coupon...
                </>
              ) : (
                "Create Coupon Template"
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl shadow-2xl shadow-slate-950/30 p-8 flex items-start justify-center min-h-[600px]">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">
                Live Preview
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-emerald-400 mx-auto rounded-full"></div>
            </div>
            <CouponPreview
              shop={selectedShop}
              title={title}
              description={description}
              expiryDate={expiryDate}
              validDays={validDays}
              badgeStyle={badgeStyle}
              footerText={footerText}
              theme={theme}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
