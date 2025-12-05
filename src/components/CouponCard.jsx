import { useMemo } from "react";

export default function CouponCard({ coupon, onClick }) {

  // Compute Backend Base URL (same as ViewCoupon.jsx)
  const backendBase = useMemo(() => {
    return (import.meta.env.VITE_API_BASE || "http://localhost:5000")
      .replace("/api", "");
  }, []);

  // Format Expiry Date
  const formattedExpiry = coupon.expiryDate
    ? coupon.expiryDate.substring(0, 10)
    : "No expiry";

  // Resolve final QR image path:
  // - If backend already sends full URL → use directly
  // - If backend sends relative path → prepend backendBase
  const qrUrl = coupon.qrImagePath
    ? coupon.qrImagePath.startsWith("http")
      ? coupon.qrImagePath
      : backendBase + coupon.qrImagePath
    : null;

  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer border"
    >
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800">
        {coupon.title}
      </h2>

      {/* Description */}
      <p className="text-gray-600 mt-1 line-clamp-2">
        {coupon.description}
      </p>

      {/* Expiry */}
      <p className="text-gray-500 text-sm mt-2">
        Expiry: <span className="font-medium">{formattedExpiry}</span>
      </p>

      {/* QR Preview */}
      {qrUrl && (
        <img
          src={qrUrl}
          alt="Coupon QR"
          className="w-32 mt-4 rounded border"
          draggable="false"
        />
      )}

      {/* View Button (IMPORTANT fix: stop event bubbling) */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevents double-navigation
          onClick();
        }}
        className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
      >
        View Coupon
      </button>
    </div>
  );
}
