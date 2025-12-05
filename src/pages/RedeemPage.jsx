import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function RedeemPage() {
  const { userCouponId } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); 

  const pdfRef = useRef();

  const backend = useMemo(() => {
    return (import.meta.env.VITE_API_BASE || "http://localhost:5000")
      .replace("/api", "");
  }, []);

  useEffect(() => {
    API.get(`/coupons/redeem/${userCouponId}`)
      .then((res) => {
        if (res.data.status === "valid") {
          setData(res.data.coupon);
          setStatus("valid");
        } else if (res.data.status === "used") {
          setData(res.data);
          setStatus("used");
        } else {
          setStatus("invalid");
        }
      })
      .catch(() => setStatus("invalid"));
  }, [userCouponId]);

  // ⭐ Client-side PDF generation (design unchanged)
  const downloadClientPDF = async () => {
    const container = pdfRef.current;
    if (!container) return;

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save(`Redeemed-${userCouponId}.pdf`);
  };

  // LOADING
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p className="text-xl text-gray-300">Checking coupon status...</p>
      </div>
    );
  }

  // INVALID
  if (status === "invalid") {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="bg-red-100 p-8 rounded-xl shadow-md text-center">
          <p className="text-red-600 text-3xl font-bold mb-3">Invalid QR Code</p>
          <p className="text-gray-700">This coupon does not exist or is corrupted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] flex-col gap-8">

      {/* 🎯 PDF CONTENT — Same UI, wrapped for PDF */}
      <div ref={pdfRef}>

        {/* Coupon USED UI — unchanged */}
        {status === "used" && (
          <div className="bg-yellow-100 p-10 rounded-2xl shadow-xl text-center max-w-lg">
            <p className="text-yellow-600 text-3xl font-bold mb-4">
              Coupon Already Used
            </p>
            <p className="text-gray-700 mb-3">
              This coupon was redeemed earlier.
            </p>
            <p className="text-gray-500 text-sm">
              Redeemed At: {new Date(data.redeemedAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* Coupon VALID UI — unchanged */}
        {status === "valid" && (
          <div className="bg-green-100 p-10 rounded-2xl shadow-xl text-center max-w-lg">

            {/* Animated Success Tick */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-500 w-20 h-20 rounded-full flex justify-center items-center animate-bounce">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-12 h-12"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-green-700 mb-4">
              Coupon Redeemed Successfully!
            </h1>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Coupon Code:</span> {data.userCouponCode}
            </p>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Coupon ID:</span> {data.userCouponId}
            </p>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Template:</span> {data.templateId?.title}
            </p>

            <p className="text-gray-600 text-sm mb-6">
              Redeemed At: {new Date(data.redeemedAt).toLocaleString()}
            </p>

            <div className="bg-white shadow-md p-4 rounded-xl">
              <p className="text-gray-700 text-sm">
                Show this page to customer as proof of redemption.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* 📥 DOWNLOAD BUTTON — outside PDF wrapper (no design changes) */}
      <button
        onClick={downloadClientPDF}
        className="px-6 py-3 bg-teal-500 text-white text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        Download PDF
      </button>
    </div>
  );
}
