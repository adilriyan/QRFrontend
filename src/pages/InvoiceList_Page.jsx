import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../api/api";
// this page for when we open shopes we can see thair incoice blonged to that shope
export default function InvoiceList() {
  const { shopId } = useParams();
  console.log(shopId);
  
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
        getInvoices()
  }, [shopId]);

 async function getInvoices() {
      const res=await  API.get(`/invoice/shop/${shopId}`)
    setInvoices(res.data.invoices || []);
 }

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>

      <Link
        to={`/invoice-form`}
        className="bg-teal-600 text-white px-4 py-2 rounded"
      >
        + Create Invoice
      </Link>

      <div className="mt-4 bg-white p-4 rounded shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2">View</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id} className="border-b">
                <td className="p-2">{inv.customerName}</td>
                <td className="p-2">₹{inv.totalAmount}</td>
                <td className="p-2">
                  <Link
                    to={`/invoice/${inv._id}`}
                    className="text-blue-600 underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
