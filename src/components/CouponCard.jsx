import { useMemo } from "react";
import { FaEye, FaQrcode } from "react-icons/fa";

export default function CouponCard({ coupon, backendBase, onClick }) {
  // Resolve QR image path
  const qrUrl = coupon.qrImagePath
    ? coupon.qrImagePath.startsWith("http")
      ? coupon.qrImagePath
      : backendBase + coupon.qrImagePath
    : null;

  // Format expiry date
  const formattedExpiry = coupon.expiryDate
    ? new Date(coupon.expiryDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No expiry";

  return (
    <div
      onClick={onClick}
      className="
        group relative bg-slate-900/80 backdrop-blur-xl border border-slate-800/80
        rounded-3xl shadow-2xl shadow-slate-950/50 hover:shadow-teal-500/40 hover:border-teal-500/60
        hover:-translate-y-3 hover:scale-[1.03] transition-all duration-500 cursor-pointer
        overflow-hidden h-[420px]
      "
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* QR Preview */}
      <div className="relative z-10 p-8 pt-12 pb-8 flex flex-col items-center">
        {qrUrl ? (
          <div className="relative group/qr">
            <img
              src={qrUrl}
              alt="Coupon QR"
              className="
                w-32 h-32 md:w-36 md:h-36 object-contain rounded-2xl border-4 border-white/30
                shadow-2xl shadow-black/20 group-hover:border-teal-400/80 group-hover:shadow-teal-500/40
                transition-all duration-300 mx-auto
              "
              loading="lazy"
              draggable="false"
            />
            <div className="absolute -inset-2 bg-teal-500/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100"></div>
          </div>
        ) : (
          <div className="
            w-32 h-32 md:w-36 md:h-36 bg-slate-800/50 border-4 border-dashed border-slate-700/50
            rounded-2xl flex items-center justify-center shadow-xl mx-auto
          ">
            <FaQrcode className="w-12 h-12 text-slate-600" />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 px-8 pb-8 space-y-4">
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-black text-slate-100 text-center leading-tight tracking-tight line-clamp-2">
          {coupon.title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm text-center leading-relaxed line-clamp-3 px-2">
          {coupon.description}
        </p>

        {/* Expiry */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 uppercase tracking-wide">
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          <span>Expires {formattedExpiry}</span>
        </div>

        {/* Action Button */}
        <button
          className="
            w-full h-14 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500
            text-slate-950 font-black rounded-3xl shadow-xl shadow-teal-500/40
            hover:from-teal-600 hover:to-emerald-600 hover:shadow-teal-500/60
            hover:scale-[1.05] transition-all duration-300 group-hover:-translate-y-1
            flex items-center justify-center gap-3 text-lg backdrop-blur-sm
          "
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <FaEye className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          View Details
        </button>
      </div>

    
      <div className="
        absolute -top-4 -right-4 w-20 h-20 bg-teal-500/20 border-4 border-teal-500/50
        rounded-3xl flex items-center justify-center backdrop-blur-xl opacity-0
        group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 shadow-2xl
      ">
        <FaQrcode className="w-8 h-8 text-teal-300 drop-shadow-lg" />
      </div>
    </div>
  );
}
