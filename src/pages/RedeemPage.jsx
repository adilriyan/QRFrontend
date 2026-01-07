import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaCheckCircle, FaTimesCircle, FaDownload, FaSpinner } from "react-icons/fa";

export default function RedeemPage() {
  const { userCouponId } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const pdfRef = useRef();

  const backend = useMemo(() => {
    return (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace("/api", "");
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


  const downloadClientPDF = async () => {
    if (!pdfRef.current || !data) return;

    setGeneratingPDF(true);

    try {
      const container = pdfRef.current;
      
      
      const clone = container.cloneNode(true);
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
      pdf.save(`Redeemed-${userCouponId}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("PDF download failed. Please try again.");
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
          <p className="text-xl text-slate-300 font-semibold">Verifying coupon...</p>
          <p className="text-slate-500 text-sm">Please wait while we check the coupon status</p>
        </div>
      </div>
    );
  }


  if (status === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="
          bg-gradient-to-br from-red-500/10 to-rose-500/10 border-4 border-red-500/30
          backdrop-blur-xl rounded-4xl shadow-2xl shadow-red-500/20 p-12 max-w-2xl mx-auto text-center
        ">
          <div className="w-28 h-28 bg-red-500/20 border-4 border-red-500/50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <FaTimesCircle className="w-20 h-20 text-red-400 animate-pulse" />
          </div>
          <h2 className="text-4xl font-black text-slate-100 mb-6 drop-shadow-2xl">
            Invalid QR Code
          </h2>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-md mx-auto">
            This coupon code doesn't exist, has expired, or is no longer valid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="
                bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200 font-black 
                px-8 py-4 rounded-3xl shadow-xl shadow-slate-900/50 hover:shadow-slate-900/70
                hover:scale-105 transition-all duration-300 text-lg
              "
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-12">
      
    
      <div ref={pdfRef} className="w-full max-w-2xl">
        
   
        {status === "used" && (
          <div className="
            bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-8 border-yellow-500/40
            backdrop-blur-xl rounded-4xl shadow-2xl shadow-yellow-500/30 p-12 sm:p-16 max-w-4xl mx-auto text-center
          ">
            <div className="w-32 h-32 bg-yellow-500/30 border-8 border-yellow-500/60 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <svg className="w-20 h-20 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-slate-100 mb-6 drop-shadow-2xl leading-tight">
              Already Redeemed
            </h1>
            
            <div className="space-y-6 mb-12">
              <p className="text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
                This coupon has already been used.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-800/50">
                <div>
                  <p className="text-slate-400 uppercase tracking-wide text-sm font-semibold mb-2">Coupon Code</p>
                  <p className="text-2xl font-mono font-black text-slate-100">{data.userCouponCode}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wide text-sm font-semibold mb-2">Redeemed At</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {new Date(data.redeemedAt).toLocaleString("en-IN", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
              Show this confirmation to your customer as proof of successful redemption.
            </p>
          </div>
        )}

   
        {status === "valid" && (
          <div className="
            bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-8 border-emerald-500/50
            backdrop-blur-xl rounded-4xl shadow-2xl shadow-emerald-500/30 p-12 sm:p-16 max-w-4xl mx-auto text-center
          ">
         
            <div className="w-36 h-36 bg-emerald-500/40 border-8 border-emerald-500/70 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce">
              <FaCheckCircle className="w-24 h-24 text-emerald-500 drop-shadow-2xl" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-slate-100 mb-8 drop-shadow-4xl leading-tight">
              Redeemed Successfully!
            </h1>
            
        
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-900/60 backdrop-blur-sm rounded-4xl p-10 mb-12 border border-slate-800/50">
              <div className="space-y-4 text-left">
                <div>
                  <p className="text-slate-400 uppercase tracking-wide text-sm font-bold mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9a6.006 6.006 0 00-4-5.659V5a2 2 0 01-2-2h-4z" />
                    </svg>
                    Coupon Code
                  </p>
                  <p className="text-3xl font-mono font-black text-slate-100 bg-slate-800/50 px-6 py-3 rounded-3xl border border-slate-700/50">
                    {data.userCouponCode}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wide text-sm font-bold mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Coupon ID
                  </p>
                  <p className="text-xl font-mono text-slate-300 bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-700/50">
                    {data.userCouponId}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 text-left">
                <div>
                  <p className="text-slate-400 uppercase tracking-wide text-sm font-bold mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Template
                  </p>
                  <p className="text-xl font-semibold text-slate-200 bg-slate-800/50 px-4 py-3 rounded-2xl border border-slate-700/50">
                    {data.templateId?.title || "Unnamed Template"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wide text-sm font-bold mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Redeemed
                  </p>
                  <p className="text-lg font-bold text-emerald-400 bg-emerald-500/20 px-6 py-4 rounded-3xl border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/30">
                    {new Date(data.redeemedAt).toLocaleString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/50 rounded-4xl p-8 mt-12">
              <p className="text-slate-300 text-xl font-semibold text-center leading-relaxed max-w-2xl mx-auto">
                🎉 Show this confirmation screen to your customer as official proof of successful coupon redemption.
              </p>
            </div>
          </div>
        )}
      </div>

    
      <button
        onClick={downloadClientPDF}
        disabled={generatingPDF}
        className="
          group w-full max-w-xs h-16 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500
          text-slate-950 font-black rounded-4xl shadow-2xl shadow-teal-500/50
          hover:from-teal-600 hover:to-emerald-600 hover:shadow-teal-500/70
          hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 text-xl
          disabled:from-slate-700/50 disabled:to-slate-800/50 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100
          backdrop-blur-xl border border-teal-500/50
        "
      >
        {generatingPDF ? (
          <>
            <FaSpinner className="w-6 h-6 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <FaDownload className="group-hover:rotate-180 transition-transform duration-300" />
            Download Receipt (PDF)
          </>
        )}
      </button>
    </div>
  );
}
