import React, { useState, useEffect } from "react";
import InvoicePreview from "../components/Shared_Invoice_Preview";
import { API } from "../api/api";

function AllInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await API.get(`/invoice/allInvoice`);
        setInvoices(response.data.invoices || []);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setInvoices([]);
      }
    };

    fetchInvoices();
  }, []);

  //  SEARCH Function
  const filteredInvoices = invoices.filter((inv) => {
    const query = search.toLowerCase();

    return (
      inv.customerName?.toLowerCase().includes(query) ||
      inv.customerPhone?.toLowerCase().includes(query) ||
      inv.eventPlace?.toLowerCase().includes(query) ||
      inv.eventType?.toLowerCase().includes(query) ||
      inv.id?.toString().includes(query)
    );
  });
  // ----------------------------------------------------

  // Pagination calculations
  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentInvoices = filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">All Invoices</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search invoice... (name, phone, place, type, id)"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full p-2 border rounded mb-6"
      />

      {filteredInvoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentInvoices.map((invoice) => (
              <div key={invoice.id}>
                <InvoicePreview shop={invoice.shopId} invoice={invoice} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-2">

            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 border rounded-md ${
                  currentPage === index + 1 ? "bg-blue-600 text-white" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Next
            </button>

          </div>
        </>
      )}
    </div>
  );
}

export default AllInvoice;
