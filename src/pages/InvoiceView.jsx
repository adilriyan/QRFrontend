import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/api";
import InvoicePreview from "../components/Shared_Invoice_Preview";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function InvoiceView() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [shop, setShop] = useState(null);
  const [status, setStatus] = useState("loading");

  const pdfRef = useRef(); 

  useEffect(() => {
    handlInvoice()
  }, [id]);

  async function handlInvoice() {
  const res= await API.get(`/invoice/specicfically/${id}`)
  setInvoice(res.data.invoice);
        setShop(res.data.invoice.shopId);
        setStatus("ready");
  }
   console.log(invoice);
   
  // const downloadPDF = async () => {
  //   const container = pdfRef.current;

  //   const canvas = await html2canvas(container, {
  //     scale: 2,
  //     useCORS: true
  //   });

  //   const imgData = canvas.toDataURL("image/png");

  //   const pdf = new jsPDF("p", "mm", "a4");

  //   const pageWidth = 210;
  //   const pageHeight = 297;

  //   // Image dimensions in mm
  //   const imgProps = pdf.getImageProperties(imgData);
  //   const ratio = imgProps.width / imgProps.height;

  //   const imgWidth = pageWidth;
  //   const imgHeight = pageWidth / ratio;

  //   pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //   pdf.save(`${invoice.invoiceNumber}.pdf`);
  // };

  if (status === "loading") {
    return <div className="p-6 text-center text-gray-600">Loading invoice…</div>;
  }

  if (status === "error") {
    return <div className="p-6 text-center text-red-600">Failed to load invoice.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Invoice Details</h1>

      {/* PDF Container */}
      <div ref={pdfRef} className="bg-white p-4 rounded shadow">
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

      {/* PDF Button */}
      {/* <div className="mt-6 flex justify-end">
        <button
          onClick={downloadPDF}
          className="px-5 py-2 bg-blue-600 text-white rounded shadow"
        >
          Download PDF
        </button>
      </div> */}
    </div>
  );
}
