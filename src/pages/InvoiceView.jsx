import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { API } from "../api/api";
import InvoicePreview from "../components/Shared_Invoice_Preview";
import html2pdf from "html2pdf.js";

export default function InvoiceView() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [shop, setShop] = useState(null);
  const [status, setStatus] = useState("loading");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const pdfRef = useRef();

  useEffect(() => {
    if (id) {
      handlInvoice();
    }
  }, [id]);

  async function handlInvoice() {
    try {
      setStatus("loading");
      const res = await API.get(`/invoice/specicfically/${id}`);
      setInvoice(res.data.invoice);
      setShop(res.data.invoice.shopId);
      setStatus("ready");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    const element = pdfRef.current;
    
    const options = {
      margin: 1,
      filename: `invoice-${invoice?.invoiceNumber || invoice?._id || 'download'}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 3, 
        useCORS: true,
        letterRendering: true,
        allowTaint: true
      },
      jsPDF: { 
        unit: "mm", 
        format: "a4", 
        orientation: "portrait" 
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    try {
      await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Loading UI
  if (status === "loading") {
    return (
      <div className="space-y-8 min-h-screen">
        {/* Page Header Skeleton */}
        <div className="space-y-2">
          <div className="h-12 w-80 bg-slate-800/50 rounded-2xl animate-pulse"></div>
          <div className="h-4 w-64 bg-slate-800/30 rounded-xl animate-pulse"></div>
        </div>

        {/* Invoice Preview Skeleton */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl animate-pulse">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-8 w-72 bg-slate-800/50 rounded-xl"></div>
              <div className="h-96 bg-slate-800/50 rounded-2xl"></div>
            </div>
            <div className="h-12 w-48 bg-slate-800/50 rounded-2xl mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error UI
  if (status === "error" || !invoice) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-6">
        <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center">
          <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-300 mb-2">Invoice Not Found</h2>
          <p className="text-slate-500 max-w-md">The invoice you're looking for doesn't exist or has been deleted.</p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/invoice-list"
            className="bg-gradient-to-r from-slate-700/90 to-slate-800/90 backdrop-blur-xl text-slate-200 font-semibold py-3 px-8 rounded-2xl hover:from-slate-800 hover:to-slate-900 shadow-xl hover:shadow-slate-900/50 transition-all duration-300 border border-slate-700/50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Invoices
          </Link>
          <Link
            to="/invoice-form"
            className="bg-gradient-to-r from-emerald-500/90 to-teal-500/90 backdrop-blur-xl text-white font-semibold py-3 px-8 rounded-2xl hover:from-emerald-600 hover:to-teal-600 shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 border border-emerald-500/40 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Invoice
          </Link>
        </div>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent tracking-tight">
                Invoice #{invoice.invoiceNumber || invoice._id?.slice(-6).toUpperCase()}
              </h1>
              <p className="text-slate-400 text-sm uppercase tracking-[0.18em] font-medium">
                {new Date(invoice.createdAt).toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to={`/invoice-list`}
            className="group bg-gradient-to-r from-slate-700/90 to-slate-800/90 backdrop-blur-xl text-slate-200 font-semibold py-4 px-8 rounded-2xl hover:from-slate-800 hover:to-slate-900 shadow-xl hover:shadow-slate-900/50 transition-all duration-300 border border-slate-700/50 flex items-center justify-center gap-3 h-min"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} strokeMiterlimit={10} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Invoices
          </Link>

          <button
            onClick={downloadPDF}
            disabled={isGeneratingPDF}
            className="group bg-gradient-to-r from-emerald-500/95 to-teal-500/95 backdrop-blur-xl text-white font-black py-4 px-10 rounded-2xl hover:from-emerald-600 hover:to-teal-600 shadow-2xl hover:shadow-emerald-500/40 transition-all duration-400 border border-emerald-500/50 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:group-hover:shadow-none"
          >
            {isGeneratingPDF ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* QUICK INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 hover:shadow-teal-500/20 hover:border-teal-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} strokeOpacity={.3} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-emerald-400 transition"></div>
          </div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-2">Customer</p>
          <p className="text-2xl font-black text-slate-100">{invoice.customerName}</p>
        </div>

        <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/30">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-blue-400 transition"></div>
          </div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-2">Event</p>
          <p className="text-xl font-bold text-slate-100 capitalize">{invoice.eventType || 'General'}</p>
          <p className="text-slate-400 text-sm mt-1">{invoice.eventDate}</p>
        </div>

        <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 hover:shadow-orange-500/20 hover:border-orange-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-500/30">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12" />
              </svg>
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-orange-400 transition"></div>
          </div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-2">Payment</p>
          <p className="text-xl font-semibold text-slate-100 capitalize flex items-center gap-2">
            {invoice.paymentMethod === "cash" && "💰 Cash"}
            {invoice.paymentMethod === "upi" && "📱 UPI"}
            {invoice.paymentMethod === "card" && "💳 Card"}
            {invoice.paymentMethod === "bank" && "🏦 Bank Transfer"}
          </p>
        </div>

        <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 hover:shadow-teal-500/20 hover:border-teal-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-teal-500/20 border border-teal-500/30">
              <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-teal-400 transition"></div>
          </div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-2">Grand Total</p>
          <p className="text-3xl font-black bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            ₹{Number(invoice.totalAmount || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* INVOICE PREVIEW */}
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800/70 rounded-3xl p-2 sm:p-4 shadow-2xl shadow-slate-950/50">
        <div ref={pdfRef} className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200/20">
          <InvoicePreview
            shop={shop}
            invoice={{
              invoiceNumber: invoice.invoiceNumber,
              customerName: invoice.customerName,
              customerPhone: invoice.customerPhone,
              eventDate: invoice.eventDate,
              eventTime: invoice.eventTime,
              eventPlace: invoice.eventPlace,
              eventType: invoice.eventType,
              items: invoice.items,
              subtotal: invoice.subtotal,
              discount: invoice.discount,
              totalAmount: invoice.totalAmount,
              amountInWords: invoice.amountInWords,
              paymentMethod: invoice.paymentMethod,
              notes: invoice.notes,
              createdAt: invoice.createdAt
            }}
          />
        </div>
      </div>
    </div>
  );
}
