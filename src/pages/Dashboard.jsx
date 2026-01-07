import { useEffect, useState } from "react";
import Chart from "../components/Chart";
import { API } from "../api/api";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalShops: 0,
    totalCoupons: 0,
    totalScans: 0,
  });

  const [dailyScans, setDailyScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    API.get("/analytics/summary")
      .then((res) => {
        setSummary(res.data.summary || {});
        setDailyScans(res.data.dailyScans || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-12 w-80 bg-slate-800/50 rounded-2xl animate-pulse"></div>
          <div className="h-4 w-64 bg-slate-800/30 rounded-xl animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-slate-800/50 rounded-2xl"></div>
              <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
            </div>
            <div className="h-4 w-32 bg-slate-800/50 rounded-xl mb-4"></div>
            <div className="h-12 w-24 bg-slate-800/50 rounded-xl"></div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-slate-800/50 rounded-2xl"></div>
              <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
            </div>
            <div className="h-4 w-32 bg-slate-800/50 rounded-xl mb-4"></div>
            <div className="h-12 w-24 bg-slate-800/50 rounded-xl"></div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-slate-800/50 rounded-2xl"></div>
              <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
            </div>
            <div className="h-4 w-32 bg-slate-800/50 rounded-xl mb-4"></div>
            <div className="h-12 w-24 bg-slate-800/50 rounded-xl"></div>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
          <div className="space-y-4 mb-8">
            <div className="h-8 w-72 bg-slate-800/50 rounded-xl"></div>
            <div className="h-4 w-56 bg-slate-800/30 rounded-lg"></div>
          </div>
          <div className="space-y-4">
            <div className="h-80 bg-slate-800/50 rounded-3xl animate-pulse"></div>
          </div>
        </div>

 
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
          <div className="h-8 w-48 bg-slate-800/50 rounded-xl mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="h-20 bg-slate-800/50 rounded-2xl"></div>
              <div className="h-20 bg-slate-800/50 rounded-2xl"></div>
            </div>
            <div className="space-y-3">
              <div className="h-20 bg-slate-800/50 rounded-2xl"></div>
              <div className="h-20 bg-slate-800/50 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-400 mt-1 text-sm uppercase tracking-[0.18em]">
            Welcome back! Here's what's happening with your QR Market
          </p>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  
        <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 hover:shadow-teal-500/20 hover:border-teal-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/30">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-teal-400 transition"></div>
          </div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-2">
            Total Shops
          </p>
          <p className="text-4xl font-black text-slate-100">
            {summary.totalShops.toLocaleString()}
          </p>
        </div>

        <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-emerald-400 transition"></div>
          </div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-2">
            Total Coupons
          </p>
          <p className="text-4xl font-black text-slate-100">
            {summary.totalCoupons.toLocaleString()}
          </p>
        </div>

        <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 hover:shadow-orange-500/20 hover:border-orange-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-500/30">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-orange-400 transition"></div>
          </div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-2">
            Total Scans
          </p>
          <p className="text-4xl font-black text-slate-100">
            {summary.totalScans.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-1">
              Scans Overview
            </h2>
            <p className="text-slate-400 text-sm">
              Monthly scan trends across all shops
            </p>
          </div>
          <div className="w-2 h-12 bg-gradient-to-b from-teal-500 to-emerald-400 rounded-full shadow-lg"></div>
        </div>
        <Chart data={dailyScans} />
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50">
        <h2 className="text-2xl font-bold text-slate-100 mb-6">
           Coming Soon
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-2xl">
              <div className="w-2 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
              <span className="text-slate-300 font-medium">Top 5 scanned coupons</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-2xl">
              <div className="w-2 h-10 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></div>
              <span className="text-slate-300 font-medium">Top performing shops</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-2xl">
              <div className="w-2 h-10 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
              <span className="text-slate-300 font-medium">Today's scans breakdown</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-2xl">
              <div className="w-2 h-10 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
              <span className="text-slate-300 font-medium">Customer retention trends</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
