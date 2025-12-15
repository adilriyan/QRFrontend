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
      PDF DOWNLOAD This fuction has some madman problem  since this my biggnig time  most off i fixed but
      even some time any thing this has some problem 
  ------------------------------------------ */
const downloadClientPDF = async () => {
  if (!pdfRef.current || !data) return;

  const original = pdfRef.current;

  // A6 size in mm
  const PDF_WIDTH_MM = 105;
  const PDF_HEIGHT_MM = 148;

  // Clone off-screen
  const clone = original.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.left = "-10000px";
  clone.style.top = "0";
  clone.style.background = "#ffffff";

  // IMPORTANT: force physical size
  clone.style.width = "105mm";
  clone.style.height = "148mm";

  document.body.appendChild(clone);

  // Wait for all images (QR, logo)
  const images = clone.querySelectorAll("img");
  await Promise.all(
    [...images].map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) resolve();
          else img.onload = img.onerror = resolve;
        })
    )
  );

  // Capture at print-quality resolution
  const canvas = await html2canvas(clone, {
    scale: 3, // ~300 DPI
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  document.body.removeChild(clone);

  const imgData = canvas.toDataURL("image/png");

  // Create exact A6 PDF
  const pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: [PDF_WIDTH_MM, PDF_HEIGHT_MM],
  });

  // SINGLE PAGE — NO SCALING
  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    PDF_WIDTH_MM,
    PDF_HEIGHT_MM
  );

  pdf.save(`Coupon-${data.userCouponCode}.pdf`);
};



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

      {/*  (for PDF capture) */}
     <div
  ref={pdfRef}
  className="bg-white rounded-xl overflow-hidden"
  style={{
    width: "105mm",
    height: "148mm",
  }}
>


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
