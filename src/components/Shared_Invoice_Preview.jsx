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
    <div
      className="
        bg-white border rounded-lg shadow-md 
        w-full h-[420px] 
        overflow-y-auto overflow-x-hidden
        p-4
      "
    >
      {/* DOWNLOAD BUTTON */}
      {!isGenerating && (
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-3 w-full text-sm"
        >
          Download PDF
        </button>
      )}

      {/* INVOICE CONTENT */}
      <div ref={invoiceRef} className="font-sans">

        {/* HEADER */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">
            {shop?.name || "Shop Name"}
          </h1>
          <p className="text-gray-600 text-sm">{shop?.address}</p>
          <h2 className="text-lg font-semibold mt-2">INVOICE</h2>
        </div>

        {/* CUSTOMER DETAILS */}
        <div className="grid grid-cols-2 gap-3 text-xs mb-4">
          <div>
            <p><strong>Customer:</strong> {invoice.customerName || "-"}</p>
            <p><strong>Phone:</strong> {invoice.customerPhone || "-"}</p>
            <p><strong>Place:</strong> {invoice.eventPlace || "-"}</p>
          </div>

          <div>
            <p><strong>Date:</strong> {invoice.eventDate || "-"}</p>
            {invoice.eventType && <p><strong>Type:</strong> {invoice.eventType}</p>}
            {invoice.eventTime && <p><strong>Time:</strong> {invoice.eventTime}</p>}
          </div>
        </div>

        {/* ITEMS TABLE */}
        <table className="w-full text-xs border-collapse mb-4">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-1 text-left">#</th>
              <th className="p-1 text-left">Item</th>
              <th className="p-1 text-right">Price</th>
              <th className="p-1 text-center">Qty</th>
              <th className="p-1 text-right">Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items?.map((it, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-1">{idx + 1}</td>
                <td className="p-1">{it.name}</td>
                <td className="p-1 text-right">₹{it.price}</td>
                <td className="p-1 text-center">{it.qty}</td>
                <td className="p-1 text-right">₹{it.qty * it.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALS */}
        <div className="text-right text-xs">
          <p><strong>Subtotal:</strong> ₹{subtotal}</p>
          <p><strong>Discount:</strong> ₹{discount}</p>
          <p className="text-sm font-bold mt-1">Grand Total: ₹{grandTotal}</p>
        </div>

        {/* PAYMENT */}
        <div className="text-right mt-1 text-xs">
          <strong>Payment Method:</strong> {invoice.paymentMethod || "—"}
        </div>

        {/* AMOUNT IN WORDS */}
        <div className="mt-2 text-xs italic text-gray-700">
          Amount in words: {invoice.amountInWords || "—"}
        </div>

        {/* NOTES */}
        {invoice.notes && (
          <div className="mt-3 text-xs">
            <strong>Description:</strong>
            <p className="mt-1 text-gray-700">{invoice.notes}</p>
          </div>
        )}

        {/* FOOTER */}
        <div className="text-center mt-4 text-gray-600 text-xs mb-2">
          <p>Thank you for your support</p>
        </div>

      </div>
    </div>
  );
}
