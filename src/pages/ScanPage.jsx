import { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CouponPreview from "../components/CouponPreview";

export default function ScanPage() {
  const { templateCode } = useParams();

  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  const pdfRef = useRef();

  const backend = useMemo(() => {
    return (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace(
      "/api",
      ""
    );
  }, []);

  /* -----------------------------------------
      FETCH COUPON DATA
  ------------------------------------------ */
  useEffect(() => {
    API.get(`/coupons/scan/${templateCode}`)
      .then((res) => {
        setData(res.data);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });
  }, [templateCode]);

  /* -----------------------------------------
      PDF DOWNLOAD This fuction has some madman problem  since this my bignig time  most off i fixed with gpt 
      even some time any thing this has some problem 
  ------------------------------------------ */
const downloadClientPDF = async () => {
  if (!pdfRef.current || !data) return;

  const safeTheme = data?.template?.theme || DEFAULT_THEME;

  const original = pdfRef.current;

  // Clone node
  const clone = original.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.top = "0";
  clone.style.left = "-9999px";
  clone.style.width = original.offsetWidth + "px";
  clone.style.background = safeTheme.primary;

  document.body.appendChild(clone);

  // Wait for images & SVGs
  const images = clone.querySelectorAll("img");
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) return resolve();
          img.onload = img.onerror = resolve;
        })
    )
  );

  // Capture
  const canvas = await html2canvas(clone, {
    scale: 3,
    useCORS: true,
    backgroundColor: null, // 👈 DO NOT FORCE WHITE
  });

  document.body.removeChild(clone);

  // Create PDF
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const imgProps = pdf.getImageProperties(imgData);
  const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
  pdf.save(`Coupon-${data.userCouponCode}.pdf`);
};



  /* -----------------------------------------
      UI STATES
  ------------------------------------------ */
  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <p className="text-gray-600 text-base">Processing QR…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <p className="text-red-500 text-base">Invalid or expired QR Code</p>
      </div>
    );
  }

  /* -----------------------------------------
      MAIN RENDER
  ------------------------------------------ */
  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 sm:px-6 py-10 gap-8">

      {/* COUPON WRAPPER (for PDF capture) */}
     <div ref={pdfRef} className="w-full flex justify-center">

        <div className="inline-block">
          <CouponPreview
            shop={data.template.shopId}
            title={data.template.title}
            description={data.template.description}
            expiryDate={data.template.expiryDate}
            validDays={data.template.validDays}
            badgeStyle={data.template.badgeStyle}
            footerText={data.template.footerText}
            userCode={data.userCouponCode}
            qrPath={data.qrPath}
            theme={data.template.theme}
          />
        </div>
      </div>

      {/* ACTION BUTTON */}
      <button
        onClick={downloadClientPDF}
        className="
          px-6 py-3
          bg-teal-600 text-white rounded-xl shadow-md
          font-semibold text-base
          w-full max-w-xs
          hover:bg-teal-700 transition
        "
      >
        Download Coupon (PDF)
      </button>
    </div>
  );
}
