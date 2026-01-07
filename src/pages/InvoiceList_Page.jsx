import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../api/api";

export default function InvoiceList() {
  const { shopId } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (shopId) {
      getInvoices();
    }
  }, [shopId]);

  async function getInvoices() {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await API.get(`/invoice/shop/${shopId}`);
      setInvoices(res.data.invoices || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }

  // Loading UI
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Page Header Skeleton */}
        <div className="space-y-2">
          <div className="h-12 w-80 bg-slate-800/50 rounded-2xl animate-pulse"></div>
          <div className="h-4 w-64 bg-slate-800/30 rounded-xl animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl animate-pulse">
          <div className="space-y-4 mb-8">
            <div className="h-8 w-72 bg-slate-800/50 rounded-xl"></div>
            <div className="h-4 w-56 bg-slate-800/30 rounded-lg"></div>
          </div>
          <div className="space-y-4">
            <div className="h-12 bg-slate-800/50 rounded-2xl"></div>
            <div className="h-12 bg-slate-800/50 rounded-2xl"></div>
            <div className="h-12 bg-slate-800/50 rounded-2xl"></div>
            <div className="h-12 bg-slate-800/50 rounded-2xl opacity-70"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error UI
  if (errorMsg) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center">
          <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-slate-300 text-xl font-medium text-center max-w-md">
          {errorMsg}
        </p>
        <button
          onClick={getInvoices}
          className="bg-gradient-to-r from-teal-500/90 to-emerald-500/90 backdrop-blur-xl text-white font-semibold py-3 px-8 rounded-2xl hover:from-teal-600 hover:to-emerald-600 shadow-xl hover:shadow-teal-500/30 transition-all duration-300 border border-teal-500/40"
        >
          Retry
        </button>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="py-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
            Invoices
          </h1>
          <p className="text-slate-400 mt-1 text-sm uppercase tracking-[0.18em]">
            Manage all invoices for this shop
          </p>
        </div>
        <Link
          to="/invoice-form"
          className="group bg-gradient-to-r from-emerald-500/90 to-teal-500/90 backdrop-blur-xl text-white font-semibold py-4 px-8 rounded-2xl hover:from-emerald-600 hover:to-teal-600 shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 border border-emerald-500/40 flex items-center gap-3"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Invoice
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-emerald-400 transition"></div>
          </div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-2">
            Total Invoices
          </p>
          <p className="text-4xl font-black text-slate-100">
            {invoices.length.toLocaleString()}
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
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-2">
            Total Revenue
          </p>
          <p className="text-4xl font-black bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            ₹{invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0).toLocaleString()}
          </p>
        </div>

        <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 hover:shadow-orange-500/20 hover:border-orange-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-500/30">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-orange-400 transition"></div>
          </div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-2">
            Avg Invoice Value
          </p>
          <p className="text-4xl font-black text-slate-100">
            ₹{invoices.length > 0 ? (invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0) / invoices.length).toLocaleString('en-IN', {maximumFractionDigits: 0}) : '0'}
          </p>
        </div>
      </div>

      {/* INVOICES TABLE */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-1">
              Recent Invoices
            </h2>
            <p className="text-slate-400 text-sm">
              All invoices for this shop {invoices.length > 0 && `(${invoices.length})`}
            </p>
          </div>
          <div className="w-2 h-12 bg-gradient-to-b from-teal-500 to-emerald-400 rounded-full shadow-lg"></div>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-300 mb-2">No invoices yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Create your first invoice to get started. Track customer orders and payments easily.
            </p>
            <Link
              to="/invoice-form"
              className="bg-gradient-to-r from-emerald-500/90 to-teal-500/90 backdrop-blur-xl text-white font-semibold py-3 px-8 rounded-2xl hover:from-emerald-600 hover:to-teal-600 shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 border border-emerald-500/40 inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Invoice
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-slate-900/70 to-slate-950/70 backdrop-blur-xl border-b border-slate-700/50 px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 text-sm font-semibold text-slate-300 uppercase tracking-wide">
                  <span className="flex items-center gap-2 font-black">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Customer
                  </span>
                  <span className="text-right md:col-span-1">Event Date</span>
                  <span className="text-right hidden lg:block">Phone</span>
                  <span className="text-right font-black">Amount</span>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-700/50 max-h-[60vh] overflow-y-auto">
                {invoices.map((inv) => (
                  <Link
                    key={inv._id}
                    to={`/invoice/${inv._id}`}
                    className="group block p-8 hover:bg-slate-800/70 transition-all duration-300 border-r-4 border-transparent hover:border-teal-500/50 hover:shadow-teal-500/10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center">
                      {/* Customer */}
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/30 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-300">
                            <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-slate-200 text-lg group-hover:text-teal-400 transition-colors">{inv.customerName}</p>
                            <p className="text-slate-500 text-sm capitalize">{inv.eventType || 'General'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Event Date */}
                      <div className="text-right">
                        <p className="font-semibold text-slate-300 text-sm">{inv.eventDate ? new Date(inv.eventDate).toLocaleDateString('en-IN') : '—'}</p>
                        <p className="text-slate-500 text-xs">{inv.eventTime || '—'}</p>
                      </div>

                      {/* Phone */}
                      <div className="text-right hidden lg:block">
                        <p className="font-mono text-slate-400 text-sm">{inv.customerPhone || '—'}</p>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <p className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                          ₹{Number(inv.totalAmount || 0).toLocaleString()}
                        </p>
                        <p className="text-emerald-400 font-semibold text-sm">{inv.amountInWords?.split(' ')[0] || ''}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
