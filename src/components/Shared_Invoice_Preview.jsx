import { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

export default function InvoicePreview({ shop, invoice }) {
  const invoiceRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);

  if (!invoice) return null;

  const subtotal = invoice.items?.reduce(
    (sum, it) => sum + it.qty * it.price,
    0
  );

  const discount = invoice.discount || 0;
  const grandTotal = subtotal - discount;

  // --------------------------
  // PDF DOWNLOAD
  // --------------------------
  const downloadPDF = async () => {
    setIsGenerating(true);

    const element = invoiceRef.current;

    const options = {
      margin: 2,
      filename: `invoice-${invoice.customerName || "download"}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    await html2pdf().set(options).from(element).save();
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* DOWNLOAD BUTTON */}
      {!isGenerating && (
        <button
          onClick={downloadPDF}
          className="group w-full bg-gradient-to-r from-teal-500/90 to-emerald-500/90 backdrop-blur-xl text-white font-semibold py-4 px-6 rounded-2xl hover:from-teal-600 hover:to-emerald-600 shadow-xl hover:shadow-teal-500/30 transition-all duration-300 border border-teal-500/40 flex items-center justify-center gap-3"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating PDF...
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
      )}

      {/* INVOICE PREVIEW CONTAINER */}
      <div className="group bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950/90 backdrop-blur-3xl border border-slate-800/60 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 hover:shadow-teal-500/20 hover:border-teal-500/50 transition-all duration-500 relative overflow-hidden">
        {/* Decorative gradient bars */}
        <div className="absolute top-4 right-4 w-2 h-24 bg-gradient-to-b from-teal-500/60 to-emerald-400/60 rounded-full shadow-lg blur-sm"></div>
        <div className="absolute bottom-4 left-4 w-2 h-20 bg-gradient-to-t from-blue-500/40 to-purple-400/40 rounded-full shadow-lg blur-sm"></div>

        {/* INVOICE CONTENT */}
        <div ref={invoiceRef} className="relative z-10">
          {/* HEADER */}
          <div className="text-center mb-8 pb-8 border-b border-slate-800/50">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-3xl shadow-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent tracking-tight mb-2">
              {shop?.name || "Shop Name"}
            </h1>
            <p className="text-slate-400 text-sm font-medium tracking-wide uppercase mb-1">{shop?.address || "Shop Address"}</p>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mx-auto mb-4 shadow-md"></div>
            <h2 className="text-2xl font-bold text-slate-200 uppercase tracking-[0.2em]">INVOICE</h2>
          </div>

          {/* CUSTOMER & EVENT DETAILS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Customer Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
                <div className="w-2 h-12 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full shadow-lg mt-1 flex-shrink-0"></div>
                <div>
                  <p className="text-slate-300 text-sm font-medium uppercase tracking-wide mb-1">Customer Details</p>
                  <p className="text-xl font-black text-slate-100">{invoice.customerName || "—"}</p>
                  <p className="text-slate-400 text-sm">{invoice.customerPhone || "—"}</p>
                  <p className="text-slate-400 text-sm">{invoice.eventPlace || "—"}</p>
                </div>
              </div>
            </div>

            {/* Event Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
                <div className="w-2 h-12 bg-gradient-to-b from-emerald-500 to-emerald-400 rounded-full shadow-lg mt-1 flex-shrink-0"></div>
                <div>
                  <p className="text-slate-300 text-sm font-medium uppercase tracking-wide mb-1">Event Details</p>
                  <p className="text-slate-100 text-sm font-semibold"><span className="text-slate-400">Date:</span> {invoice.eventDate || "—"}</p>
                  {invoice.eventType && <p className="text-slate-100 text-sm font-semibold"><span className="text-slate-400">Type:</span> {invoice.eventType}</p>}
                  {invoice.eventTime && <p className="text-slate-100 text-sm font-semibold"><span className="text-slate-400">Time:</span> {invoice.eventTime}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-10 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full shadow-lg"></div>
              <h3 className="text-2xl font-bold text-slate-100">Items Breakdown</h3>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-slate-900/50 to-slate-950/50 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4">
                <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-slate-300 uppercase tracking-wide">
                  <span>#</span>
                  <span className="text-left">Item</span>
                  <span className="text-right">Price</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Total</span>
                </div>
              </div>
              <div className="divide-y divide-slate-700/50">
                {invoice.items?.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-4 items-center px-6 py-5 hover:bg-slate-800/70 transition-colors duration-200 group">
                    <div className="text-slate-400 font-mono text-sm">{idx + 1}</div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-200 group-hover:text-teal-400 transition-colors">{it.name}</p>
                    </div>
                    <div className="text-right font-mono text-slate-300">₹{Number(it.price).toLocaleString()}</div>
                    <div className="text-center font-mono text-slate-300 font-semibold px-3 py-1 bg-slate-700/50 rounded-xl min-w-[3rem]">{it.qty}</div>
                    <div className="text-right font-bold text-lg bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                      ₹{Number(it.qty * it.price).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TOTALS SECTION */}
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-2 text-right gap-4">
              <div>
                <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">Subtotal</p>
                <p className="text-2xl font-black text-slate-200">₹{Number(subtotal).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">Discount</p>
                <p className="text-xl font-semibold text-emerald-400 -mt-1">-{Number(discount).toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-teal-500/20 to-emerald-500/20 backdrop-blur-xl border border-teal-500/40 rounded-3xl p-6 shadow-2xl shadow-teal-500/20">
              <p className="text-slate-400 text-sm uppercase tracking-wide mb-2 text-right">Grand Total</p>
              <p className="text-4xl font-black bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 bg-clip-text text-transparent text-right tracking-tight">
                ₹{Number(grandTotal).toLocaleString()}
              </p>
            </div>
          </div>

          {/* PAYMENT & WORDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12" />
                </svg>
                Payment Method
              </p>
              <p className="text-xl font-bold text-slate-100 capitalize">
                {invoice.paymentMethod === "cash" && "💰 Cash"}
                {invoice.paymentMethod === "upi" && "📱 UPI"}
                {invoice.paymentMethod === "card" && "💳 Card"}
                {invoice.paymentMethod === "bank" && "🏦 Bank Transfer"}
                {!invoice.paymentMethod && "—"}
              </p>
            </div>

            <div className="p-6 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Amount in Words
              </p>
              <p className="text-lg font-semibold text-slate-200 italic leading-relaxed">
                {invoice.amountInWords || "Zero rupees only"}
              </p>
            </div>
          </div>

          {/* NOTES */}
          {invoice.notes && (
            <div className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-purple-500/30 rounded-3xl shadow-xl">
              <p className="text-slate-300 text-sm font-medium uppercase tracking-wide mb-4 flex items-center gap-2">
                📝 Special Instructions
              </p>
              <p className="text-slate-200 text-base leading-relaxed">{invoice.notes}</p>
            </div>
          )}

          {/* FOOTER */}
          <div className="pt-12 mt-12 border-t-4 border-gradient-to-r border-from-teal-500 border-to-emerald-500 border-opacity-50 text-center">
            <div className="w-24 h-1 bg-gradient-to-r from-slate-400 to-transparent rounded-full mx-auto mb-6 shadow-md"></div>
            <p className="text-slate-500 font-medium text-lg tracking-wide uppercase mb-2">Thank you for choosing us</p>
            <p className="text-slate-600 text-sm">Professional service • Quality guaranteed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
