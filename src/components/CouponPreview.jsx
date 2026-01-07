import React, { useMemo } from "react";

const badgeStyles = {
  HolidaySpecial: {
    bg: "bg-gradient-to-br from-teal-400/90 to-emerald-400/90 backdrop-blur-sm text-teal-900 shadow-lg shadow-teal-500/30",
    label: "HOLIDAY SPECIALS",
  },
  MegaSale: {
    bg: "bg-gradient-to-br from-yellow-400/90 to-orange-400/90 backdrop-blur-sm text-yellow-900 shadow-lg shadow-yellow-500/30",
    label: "MEGA SALE",
  },
  LimitedOffer: {
    bg: "bg-gradient-to-br from-purple-400/90 to-violet-400/90 backdrop-blur-sm text-purple-900 shadow-lg shadow-purple-500/30",
    label: "LIMITED OFFER",
  },
  FlashDeal: {
    bg: "bg-gradient-to-br from-red-400/90 to-rose-400/90 backdrop-blur-sm text-red-900 shadow-lg shadow-red-500/30",
    label: "FLASH DEAL",
  },
  WinterFest: {
    bg: "bg-gradient-to-br from-blue-400/90 to-indigo-400/90 backdrop-blur-sm text-blue-900 shadow-lg shadow-blue-500/30",
    label: "WINTER FEST",
  },
  NewYear: {
    bg: "bg-gradient-to-br from-emerald-400/90 to-teal-400/90 backdrop-blur-sm text-emerald-900 shadow-lg shadow-emerald-500/30",
    label: "NEW YEAR",
  },
  Opening: {
    bg: "bg-gradient-to-br from-rose-400/90 to-pink-400/90 backdrop-blur-sm text-rose-900 shadow-lg shadow-rose-500/30",
    label: "GRAND OPENING",
  },
  Onam: {
    bg: "bg-gradient-to-br from-orange-400/90 to-amber-400/90 backdrop-blur-sm text-orange-900 shadow-lg shadow-orange-500/30",
    label: "ONAM SPECIAL",
  },
  Default: {
    bg: "bg-gradient-to-br from-slate-200/80 to-slate-300/80 backdrop-blur-sm text-slate-800 shadow-lg shadow-slate-400/30",
    label: "SPECIAL OFFER",
  },
};

const badgeStickers = {
  HolidaySpecial: "https://res.cloudinary.com/dgjsbjmph/image/upload/v1765806646/Holiday_brwrsx.svg",
  MegaSale: "https://res.cloudinary.com/dgjsbjmph/image/upload/v1765806877/MGsale_ctzadc.svg",
  LimitedOffer: "https://res.cloudinary.com/dgjsbjmph/image/upload/v1765806627/Limited_vhvtkm.svg",
  FlashDeal: "https://res.cloudinary.com/dgjsbjmph/image/upload/v1765806637/Flash_xqy9q8.svg",
  WinterFest: "https://res.cloudinary.com/dgjsbjmph/image/upload/v1765806639/Chrismes_akmc6z.svg",
  NewYear: "https://res.cloudinary.com/dgjsbjmph/image/upload/v1765806626/NEWYear_lmht25.svg",
  Opening: "https://res.cloudinary.com/dgjsbjmph/image/upload/v1765806637/GR_qfwb4h.svg",
  Onam: "https://res.cloudinary.com/dgjsbjmph/image/upload/v1765806633/Onam_mtyy2u.svg",
  Default: "",
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
  theme,
}) {
  const DEFAULT_THEME = {
    primary: "#ffffff",
    footer: "#111827",
    text: "#0f172a",
  };

  const safeTheme = theme || DEFAULT_THEME;

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
    <div 
      className="
        rounded-3xl shadow-2xl border-4 border-slate-200/50
        mx-auto w-full max-w-[380px] overflow-hidden
        hover:shadow-teal-500/20 hover:-translate-y-2 transition-all duration-500
      "
      style={{
        backgroundColor: safeTheme?.primary || "#ffffff",
        color: safeTheme?.text || "#000000",
      }}
    >
  
      <div className="p-6 md:p-8 relative">
     
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${safeTheme.primary}20 0%, ${safeTheme.footer}20 100%)`
          }}
        />

    
        <div className="flex justify-between items-start mb-8 relative z-10">
       
          <div className="max-w-[65%] space-y-2">
            <h1 
              className="text-2xl md:text-3xl font-black leading-tight drop-shadow-lg"
              style={{ color: safeTheme.text }}
            >
              {shop?.name || "Shop Name"}
            </h1>
            
            <p 
              className="uppercase tracking-[0.2em] text-xs md:text-sm font-semibold opacity-90"
              style={{ color: safeTheme.text }}
            >
              {shop?.category || "Category"}
            </p>

            {shop?.address && (
              <p 
                className="flex items-center gap-1.5 text-xs md:text-sm mt-1 opacity-80"
                style={{ color: safeTheme.text }}
              >
                📍 {shop.address}
              </p>
            )}
          </div>

         
          <div className="relative">
            <img
              src={shopLogo}
              className="
                w-24 h-32 md:w-28 md:h-36 object-cover 
                rounded-2xl border-4 border-white/80 shadow-2xl shadow-black/20
                hover:scale-105 transition-transform duration-300
              "
              alt="Shop Logo"
              loading="lazy"
            />
          </div>
        </div>

   
        <p 
          className="text-center uppercase tracking-[0.3em] text-xs md:text-sm font-semibold mb-8 px-4 opacity-90"
          style={{ color: safeTheme.text }}
        >
          SCAN AT SHOP
        </p>

  
        <div className="text-center mb-10 relative z-10">
          <h2 className="text-xl md:text-2xl font-black mb-3 leading-tight px-4">
            {title || "Coupon Title"}
          </h2>
          
          <p 
            className="text-sm md:text-base px-6 md:px-8 leading-relaxed break-words opacity-90"
            style={{ color: safeTheme.text }}
          >
            {description || "Offer description will appear here..."}
          </p>
        </div>

     
        <div className="grid grid-cols-3 items-center gap-4 mb-8 relative z-10">

          <div className="space-y-6 pr-2">
            <div>
              <p className="uppercase tracking-[0.2em] text-xs font-bold opacity-80 mb-1">
                VALID FOR
              </p>
              <p 
                className="text-5xl md:text-6xl leading-none font-black drop-shadow-lg"
                style={{ color: safeTheme.text }}
              >
                {validDays || "7"}
              </p>
              <p className="text-base font-semibold -mt-1 opacity-90" style={{ color: safeTheme.text }}>
                DAYS
              </p>
            </div>
            
            <div>
              <p className="uppercase tracking-[0.2em] text-xs font-bold opacity-80 mb-2">
                YOUR CODE
              </p>
              <p 
                className="font-mono text-lg md:text-xl font-black tracking-wider px-3 py-2 rounded-lg shadow-md"
                style={{
                  color: safeTheme.text,
                  backgroundColor: `${safeTheme.text}15`
                }}
              >
                {userCode || "ABC123"}
              </p>
            </div>
          </div>


          <div className="flex justify-center items-center p-2">
            {sticker ? (
              <div className="w-28 h-32 flex items-center justify-center">
                <img
                  src={sticker}
                  className="w-full h-full object-contain drop-shadow-2xl"
                  alt="Badge"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className={`
                w-28 h-28 rounded-3xl shadow-2xl shadow-black/20
                flex items-center justify-center p-4
                ${badge.bg} text-xs font-black uppercase tracking-widest
                text-center leading-tight
              `}>
                {badge.label}
              </div>
            )}
          </div>

       
          <div className="flex justify-end items-center pl-2">
            {qrURL ? (
              <img
                src={qrURL}
                className="
                  w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white/90
                  shadow-2xl shadow-black/30 hover:shadow-teal-500/50
                  transition-all duration-300 cursor-pointer
                "
                alt="QR Code"
                loading="lazy"
              />
            ) : (
              <div 
                className="
                  w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-slate-300/50
                  bg-gradient-to-br from-slate-200/50 to-slate-300/50
                  flex items-center justify-center shadow-xl
                "
                style={{ color: safeTheme.text }}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-center px-1">
                  QR Preview
                </span>
              </div>
            )}
          </div>
        </div>


        <div className="text-center mb-8 relative z-10">
          <p 
            className="text-sm md:text-base font-semibold opacity-90 px-4"
            style={{ color: safeTheme.text }}
          >
            <span className="font-black">Valid Until:</span>{' '}
            <span className="font-mono tracking-wider">{expiryDate || "DD/MM/YYYY"}</span>
          </p>
        </div>
      </div>

  
      <div
        className="
          py-6 px-8 flex justify-between items-center shadow-2xl shadow-black/40
          border-t-4 border-white/20
        "
        style={{
          backgroundColor: safeTheme?.footer || "#111827",
          color: safeTheme?.text || "#ffffff",
        }}
      >
        <p 
          className="text-lg md:text-xl font-black uppercase tracking-wide drop-shadow-lg"
          style={{ color: safeTheme.text }}
        >
          {footerText || "#SeeYouThere"}
        </p>

        <div className="text-right leading-tight opacity-90">
          <p className="text-sm md:text-base font-bold">RORONOA</p>
          <p className="text-xs md:text-sm font-semibold opacity-75">ADmarketing</p>
        </div>
      </div>
    </div>
  );
}
