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

// ⚠ Add your Cloudinary sticker URLs here
const badgeStickers = {
  HolidaySpecial: "https://your-cloudinary-url/holiday.png",
  MegaSale: "https://your-cloudinary-url/mega.png",
  LimitedOffer: "https://your-cloudinary-url/limited.png",
  FlashDeal: "https://your-cloudinary-url/flash.png",
  WinterFest: "https://your-cloudinary-url/winter.png",
  Default: "https://your-cloudinary-url/default.png",
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
  const sticker = badgeStickers[badgeStyle] || badgeStickers.Default;

  const shopLogo = shop?.logo || "https://via.placeholder.com/150";
  const qrURL = qrPath || null;

  return (
    <div className="bg-white rounded-3xl shadow-xl border mx-auto w-full max-w-[850px] overflow-hidden">

      {/* BODY */}
      <div className="p-8">

        {/* HEADER - FIXED LAYOUT */}
        <div className="flex justify-between items-start">

          {/* SHOP INFO */}
          <div className="max-w-[60%]">
            <h1 className="text-4xl font-bold leading-tight">
              {shop?.name}
            </h1>

            <p className="uppercase tracking-wide text-gray-600 text-sm mt-1">
              {shop?.category}
            </p>

            {shop?.address && (
              <p className="flex items-center gap-2 text-gray-700 mt-4 text-sm">
                📍 {shop.address}
              </p>
            )}
          </div>

          {/* POSTER IMAGE */}
          <img
            src={shopLogo}
            className="w-32 h-40 object-cover rounded-lg border shadow"
            alt="logo"
          />
        </div>

        {/* SUBTEXT */}
        <p className="text-center mt-10 uppercase text-gray-700 text-sm tracking-wide">
          Scan your QR at shop
        </p>

        {/* TITLE + DESCRIPTION */}
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold">{title}</h2>

          <p className="text-gray-600 mt-1 text-sm break-words px-3">
            {description}
          </p>
        </div>

        {/* FIXED 3-COLUMN SECTION (EXACT DESIGN MATCH) */}
        <div className="mt-12 grid grid-cols-3 items-center">

          {/* LEFT - VALIDITY */}
          <div className="pl-6">
            <p className="font-bold uppercase text-sm">VALID FOR</p>
            <p className="text-[80px] leading-none font-extrabold mt-2">
              {validDays}
            </p>
            <p className="text-lg -mt-2">days</p>

            <p className="mt-10 uppercase font-bold text-sm">Your Code</p>
            <p className="font-mono text-xl mt-1">{userCode}</p>
          </div>

          {/* CENTER - STICKER BADGE */}
          <div className="flex justify-center">
            <img
              src={sticker}
              className="w-36 h-36 object-contain drop-shadow-lg"
              alt="badge"
            />
          </div>

          {/* RIGHT - QR */}
          <div className="flex justify-center pr-4">
            {qrURL ? (
              <img
                src={qrURL}
                className="w-32 h-32 rounded-md border shadow-md"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-md border flex items-center justify-center">
                <p className="text-xs text-gray-600">QR Preview</p>
              </div>
            )}
          </div>

        </div>

        {/* EXPIRY */}
        <p className="text-center mt-10 text-gray-600 text-sm">
          <span className="font-semibold">Valid Until:</span> {expiryDate}
        </p>
      </div>

      {/* FOOTER */}
      <div className="bg-gray-900 text-white py-5 px-8 flex justify-between items-center">
        <p className="text-lg font-semibold">{footerText}</p>

        <div className="text-right opacity-80 leading-none">
          <p className="text-sm">RORONOA</p>
          <p className="text-xs opacity-60">ADmarketing</p>
        </div>
      </div>
    </div>
  );
}
