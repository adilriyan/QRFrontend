import { useEffect, useState, useMemo, useRef } from "react";
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

  useEffect(() => {
    API.get(`/coupons/scan/${templateCode}`)
      .then((res) => {
        setData(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [templateCode]);

  const downloadClientPDF = async () => {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
      windowWidth: 1200
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save(`Coupon-${data.userCouponCode}.pdf`);
  };

  if (status === "loading")
    return (
      <div className="min-h-[60vh] flex justify-center items-center text-sm sm:text-base">
        Loading…
      </div>
    );

  if (status === "error")
    return (
      <div className="min-h-[60vh] flex justify-center items-center text-red-500 text-sm sm:text-base">
        Invalid QR
      </div>
    );

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] px-4 sm:px-6 md:px-8 lg:px-0 gap-6 sm:gap-8 md:gap-10">
      {/* Coupon Preview */}
      <div ref={pdfRef} className="w-full flex justify-center">
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
        />
      </div>

      {/* Download Button */}
      <button
        onClick={downloadClientPDF}
        className="
          px-4 sm:px-6 py-2 sm:py-3
          bg-teal-500 text-white rounded-xl shadow font-semibold
          w-full max-w-xs sm:max-w-sm md:max-w-md
          text-sm sm:text-base
        "
      >
        Download PDF
      </button>
    </div>
  );
}
