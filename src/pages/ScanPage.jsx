import { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CouponPreview from "../components/CouponPreview";
import { FaSpinner, FaDownload } from "react-icons/fa";

export default function ScanPage() {
  const { templateCode } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const pdfRef = useRef();

  const backend = useMemo(() => {
    return (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace("/api", "");
  }, []);

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

  const downloadClientPDF = async () => {
    if (!pdfRef.current || !data) return;
    setGeneratingPDF(true);

    try {
      const clone = pdfRef.current.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      clone.style.width = "595px";
      clone.style.background = "white";
      clone.style.padding = "40px";
      
      document.body.appendChild(clone);
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
      pdf.save(`Coupon-${data.userCouponCode}.pdf`);
    } catch (error) {
      console.error("PDF failed:", error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-slate-800/50 border-4 border-slate-700/50 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
            <FaSpinner className="w-10 h-10 text-slate-600 animate-spin" />
          </div>
          <p className="text-xl text-slate-300 font-semibold">Generating coupon...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="
          bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-4 border-slate-800/50
          backdrop-blur-xl rounded-4xl shadow-2xl shadow-slate-950/50 p-12 max-w-2xl mx-auto text-center
        ">
          <div className="w-28 h-28 bg-slate-800/50 border-4 border-slate-700/50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-16 h-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-100 mb-4">QR Code Not Found</h2>
          <p className="text-xl text-slate-400 mb-8 leading-relaxed max-w-md mx-auto">
            This coupon template doesn't exist or the QR code is invalid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-12">
      
      
      <div ref={pdfRef} className="w-full flex justify-center max-w-4xl">
        <div className="w-full max-w-2xl">
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

      
      <button
        onClick={downloadClientPDF}
        disabled={generatingPDF}
        className="
          group w-full max-w-sm h-16 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500
          text-slate-950 font-black rounded-4xl shadow-2xl shadow-teal-500/50
          hover:from-teal-600 hover:to-emerald-600 hover:shadow-teal-500/70 hover:scale-105
          transition-all duration-300 flex items-center justify-center gap-3 text-xl
          disabled:from-slate-700/50 disabled:to-slate-800/50 disabled:shadow-none disabled:cursor-not-allowed
          backdrop-blur-xl border border-teal-500/50
        "
      >
        {generatingPDF ? (
          <>
            <FaSpinner className="w-6 h-6 animate-spin" />
            Preparing PDF...
          </>
        ) : (
          <>
            <FaDownload className="group-hover:rotate-180 transition-transform duration-300" />
            Download Coupon (PDF)
          </>
        )}
      </button>
    </div>
  );
}
