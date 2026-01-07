import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InvoicePreview from "../components/Shared_Invoice_Preview";
import { API } from "../api/api";

function AllInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        const response = await API.get(`/invoice/allInvoice`);
        setInvoices(response.data.invoices || []);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setErrorMsg("Failed to load invoices");
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // SEARCH Function
  const filteredInvoices = invoices.filter((inv) => {
    const query = search.toLowerCase();
    return (
      inv.customerName?.toLowerCase().includes(query) ||
      inv.customerPhone?.toLowerCase().includes(query) ||
      inv.eventPlace?.toLowerCase().includes(query) ||
      inv.eventType?.toLowerCase().includes(query) ||
      (inv._id || inv.id)?.toString().toLowerCase().includes(query) ||
      (inv.invoiceNumber || '').toLowerCase().includes(query)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentInvoices = filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Loading UI
  if (loading) {
    return (
      <div className="space-y-8 py-12">
        {/* Page Header Skeleton */}
        <div className="space-y-2">
          <div className="h-12 w-80 bg-slate-800/50 rounded-2xl animate-pulse"></div>
          <div className="h-4 w-64 bg-slate-800/30 rounded-xl animate-pulse"></div>
        </div>

        {/* Search & Grid Skeleton */}
        <div className="space-y-6">
          <div className="h-14 w-full max-w-md bg-slate-800/50 rounded-2xl animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl animate-pulse h-96">
                <div className="space-y-4">
                  <div className="h-8 w-48 bg-slate-800/50 rounded-xl"></div>
                  <div className="h-64 bg-slate-800/50 rounded-2xl"></div>
                  <div className="h-10 w-32 bg-slate-800/50 rounded-xl mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error UI
  if (errorMsg && filteredInvoices.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-8 py-12">
        <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center">
          <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-300 mb-2">{errorMsg}</h2>
          <p className="text-slate-500 max-w-md">Please check your connection and try refreshing the page.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-teal-500/90 to-emerald-500/90 backdrop-blur-xl text-white font-semibold py-3 px-8 rounded-2xl hover:from-teal-600 hover:to-emerald-600 shadow-xl hover:shadow-teal-500/30 transition-all duration-300 border border-teal-500/40"
          >
            Refresh
          </button>
          <Link
            to="/invoice-form"
            className="bg-gradient-to-r from-slate-700/90 to-slate-800/90 backdrop-blur-xl text-slate-200 font-semibold py-3 px-8 rounded-2xl hover:from-slate-800 hover:to-slate-900 shadow-xl hover:shadow-slate-900/50 transition-all duration-300 border border-slate-700/50"
          >
            Create Invoice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent tracking-tight mb-2">
            All Invoices
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            {filteredInvoices.length} of {invoices.length} invoices
            {search && ` • "${search}"`}
          </p>
        </div>
        <Link
          to="/invoice-form"
          className="group bg-gradient-to-r from-emerald-500/95 to-teal-500/95 backdrop-blur-xl text-white font-black py-5 px-10 rounded-3xl hover:from-emerald-600 hover:to-teal-600 shadow-2xl hover:shadow-emerald-500/40 transition-all duration-500 border border-emerald-500/50 flex items-center gap-3 self-start lg:self-auto"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Invoice
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="max-w-2xl">
        <div className="group relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by customer, phone, place, type, or invoice ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-6 py-5 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl text-slate-100 placeholder-slate-500 text-lg font-medium focus:border-teal-500/60 focus:ring-4 focus:ring-teal-500/20 focus:outline-none transition-all duration-300 shadow-2xl hover:shadow-teal-500/10"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1 hover:bg-slate-800/50 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Invoices Grid */}
      <div className="space-y-8">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-32 h-32 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <svg className="w-20 h-20 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l.01 0m5.098 2.09a3 3 0 01-5.196 0" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-slate-300 mb-4">
              {search ? "No matching invoices" : "No invoices yet"}
            </h3>
            <p className="text-xl text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
              {search 
                ? `No invoices found for "${search}". Try different search terms.` 
                : "Get started by creating your first invoice to track customer orders and payments."
              }
            </p>
            <Link
              to="/invoice-form"
              className="bg-gradient-to-r from-emerald-500/95 to-teal-500/95 backdrop-blur-xl text-white font-black py-5 px-12 rounded-3xl hover:from-emerald-600 hover:to-teal-600 shadow-2xl hover:shadow-emerald-500/40 transition-all duration-500 border border-emerald-500/50 inline-flex items-center gap-3 text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {search ? "Create New Invoice" : "Create First Invoice"}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {currentInvoices.map((invoice) => (
                <Link
                  key={invoice._id || invoice.id}
                  to={`/invoice/${invoice._id || invoice.id}`}
                  className="group relative block h-[420px] w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl shadow-slate-950/50 hover:shadow-teal-500/30 hover:border-teal-500/60 hover:-translate-y-2 transition-all duration-500 overflow-hidden hover:shadow-2xl"
                >
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-emerald-500/3 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Quick Info Badge */}
                  <div className="relative z-10 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-slate-700/80 to-slate-800/80 backdrop-blur-xl text-slate-400 text-xs font-semibold uppercase tracking-wider rounded-full border border-slate-700/50">
                        #{invoice.invoiceNumber || invoice._id?.slice(-6).toUpperCase()}
                      </span>
                      <div className="w-2 h-2 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform origin-left duration-300"></div>
                    </div>
                    <h3 className="text-xl font-black text-slate-100 group-hover:text-teal-400 transition-colors mb-1 leading-tight">
                      {invoice.customerName}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium capitalize">{invoice.eventType || 'General'}</p>
                  </div>

                  {/* Preview Container */}
                  <div className="relative z-10 flex-1">
                    <div className="h-full bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-inner border border-slate-200/30 group-hover:shadow-teal-200/20 transition-shadow">
                      <InvoicePreview 
                        shop={invoice.shopId} 
                        invoice={invoice} 
                        className="h-full w-full [&>*]:!h-full"
                      />
                    </div>
                  </div>

                  {/* Amount Overlay */}
                  <div className="relative z-20 mt-4 pt-4 border-t border-slate-800/50">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-sm font-medium uppercase tracking-wide">Total</span>
                      <div className="text-right">
                        <p className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                          ₹{Number(invoice.totalAmount || 0).toLocaleString()}
                        </p>
                        <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">{invoice.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  {/* Hover Action */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6 pointer-events-none">
                    <div className="w-full text-center">
                      <svg className="w-8 h-8 text-teal-400 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <p className="text-teal-300 font-semibold text-lg">View Details</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-12 border-t border-slate-800/50">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="group disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 text-slate-300 font-semibold rounded-2xl hover:bg-slate-800/80 hover:border-slate-700/80 hover:text-slate-200 shadow-xl hover:shadow-slate-900/50 transition-all duration-300 disabled:shadow-none min-w-[52px]"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform inline-block mr-1" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Prev
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = currentPage <= 3 
                      ? i + 1 
                      : currentPage >= totalPages - 2 
                      ? totalPages - 4 + i 
                      : currentPage - 2 + i;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-3 font-semibold rounded-xl transition-all duration-300 shadow-lg min-w-[48px] ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-teal-500/40 hover:shadow-teal-500/60"
                            : "bg-slate-900/80 border border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700/80 hover:text-slate-200 hover:shadow-slate-900/50 shadow-xl"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="group disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 text-slate-300 font-semibold rounded-2xl hover:bg-slate-800/80 hover:border-slate-700/80 hover:text-slate-200 shadow-xl hover:shadow-slate-900/50 transition-all duration-300 disabled:shadow-none min-w-[52px]"
                >
                  Next
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform inline-block ml-1" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {totalPages > 5 && (
                  <span className="text-slate-500 font-medium px-4 py-3">
                    ... {totalPages}
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AllInvoice;
