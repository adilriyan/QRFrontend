import React, { useMemo } from "react";

const badgeStyles = {
  HolidaySpecial: {
    bg: "bg-teal-100 border-teal-300 text-teal-700",
    label: "Holiday Specials",
  },
  MegaSale: {
    bg: "bg-yellow-100 border-yellow-300 text-yellow-700",
    label: "Mega Sale",
  },
  LimitedOffer: {
    bg: "bg-purple-100 border-purple-300 text-purple-700",
    label: "Limited Offer",
  },
  FlashDeal: {
    bg: "bg-red-100 border-red-300 text-red-700",
    label: "Flash Deal",
  },
  WinterFest: {
    bg: "bg-blue-100 border-blue-300 text-blue-700",
    label: "Winter Fest",
  },
  Default: {
    bg: "bg-gray-100 border-gray-300 text-gray-700",
    label: "Special Offer",
  },
};

export default function CouponPreview({
  shop = {},
  title,
  description,
  expiryDate,
  validDays,
  badgeStyle = "Default",
  footerText = "#SeeYouThere",
  userCode,
  qrPath,
}) {
  const backend = useMemo(() => {
    return (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace(
      "/api",
      ""
    );
  }, []);

  const badge = badgeStyles[badgeStyle] || badgeStyles.Default;
  const shopLogo = shop?.logo || "https://via.placeholder.com/150";
  const qrURL = qrPath || null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border mx-auto w-full max-w-[780px] overflow-hidden">

      {/* BODY */}
      <div className="p-6 sm:p-8">

        {/* HEADER - Shop + Logo */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          
          {/* SHOP INFO */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight break-words">
              {shop?.name || "SHOP NAME"}
            </h1>

            <p className="uppercase tracking-wide text-gray-600 text-sm mt-2">
              {shop?.category || ""}
            </p>

            {shop?.address && (
              <p className="flex items-center gap-2 text-gray-600 text-sm mt-3 break-all">
                📍 {shop.address}
              </p>
            )}
          </div>

          {/* LOGO */}
          <img
            src={shopLogo}
            className="w-28 h-32 sm:w-32 sm:h-36 object-cover rounded-lg border shadow shrink-0"
            alt="logo"
          />
        </div>

        {/* SUBTEXT */}
        <p className="text-center mt-6 uppercase text-gray-700 text-sm">
          Scan your QR at shop
        </p>

        {/* MID GRID */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">

          {/* VALIDITY */}
          <div className="sm:col-span-5 text-center sm:text-left">
            <p className="uppercase text-sm font-bold">Valid For</p>

            <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-2">
              <p className="text-5xl sm:text-6xl font-extrabold">
                {validDays || "--"}
              </p>
              <p className="text-lg text-gray-700 mt-1">days</p>
            </div>
          </div>

          {/* BADGE */}
          <div className="sm:col-span-4 flex justify-center">
            <div
              className={`px-5 py-2 rounded-full border shadow-sm text-sm font-bold ${badge.bg}`}
            >
              {badge.label}
            </div>
          </div>

          {/* QR - FIXED SIZE */}
          <div className="sm:col-span-3 flex justify-center">
            {qrURL ? (
              <img
                src={qrURL}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-md border shadow shrink-0 min-w-[7rem]"
                alt="QR"
              />
            ) : (
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-200 flex items-center justify-center rounded-md border shrink-0">
                <p className="text-xs text-gray-500">QR Preview</p>
              </div>
            )}
          </div>

        </div>

        {/* DESCRIPTION */}
        <div className="mt-10">
          <h2 className="text-2xl sm:text-3xl font-bold">
            {title || "Coupon Title"}
          </h2>

          <p className="text-gray-600 mt-2 text-sm sm:text-base break-words">
            {description || "Coupon description…"}
          </p>

          <p className="mt-6 uppercase text-sm font-bold">Your Code</p>

          <p className="font-mono text-xl sm:text-2xl mt-1 break-all">
            {userCode || "XXXXX-XXXX"}
          </p>
        </div>

        {/* EXPIRY */}
        <p className="mt-6 text-sm text-gray-600">
          <span className="font-medium">Valid Until:</span> {expiryDate}
        </p>
      </div>

      {/* FOOTER */}
      <div className="w-full bg-gray-900 text-white py-4 px-6 flex items-center justify-between">
        <p className="text-lg font-semibold">{footerText}</p>

        <div className="text-right leading-tight">
          <p className="text-sm opacity-80">RORONOA</p>
          <p className="text-xs opacity-60">ADmarketing</p>
        </div>
      </div>
    </div>
  );
}
