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

  // -----------------------------------------
  // Fetch analytics summary
  // -----------------------------------------
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

  // -----------------------------------------
  // Loading UI
  // -----------------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-white text-xl font-medium">Loading dashboard...</p>
      </div>
    );
  }

  // -----------------------------------------
  // Error UI
  // -----------------------------------------
  if (errorMsg) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-400 text-xl font-medium">{errorMsg}</p>
      </div>
    );
  }

  // -----------------------------------------
  // MAIN UI
  // -----------------------------------------
  return (
    <div className="space-y-8">

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-black drop-shadow-lg">
        Dashboard
      </h1>

      {/* ------------------------------ */}
      {/* SUMMARY CARDS */}
      {/* ------------------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Shops */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border-l-8 border-blue-500 hover:shadow-2xl transition">
          <p className="text-gray-600 font-medium">Total Shops</p>
          <h2 className="text-4xl font-extrabold text-blue-600 mt-3">
            {summary.totalShops}
          </h2>
        </div>

        {/* Total Coupons */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border-l-8 border-green-500 hover:shadow-2xl transition">
          <p className="text-gray-600 font-medium">Total Coupons</p>
          <h2 className="text-4xl font-extrabold text-green-600 mt-3">
            {summary.totalCoupons}
          </h2>
        </div>

        {/* Total Scans */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border-l-8 border-orange-500 hover:shadow-2xl transition">
          <p className="text-gray-600 font-medium">Total Scans</p>
          <h2 className="text-4xl font-extrabold text-orange-600 mt-3">
            {summary.totalScans}
          </h2>
        </div>
      </div>

      {/* ------------------------------ */}
      {/* DAILY SCANS CHART */}
      {/* ------------------------------ */}
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Scans Overview
        </h2>

        {/* Pass daily scans data to chart */}
        <Chart data={dailyScans} />
      </div>

      {/* ------------------------------ */}
      {/* FUTURE INSIGHTS */}
      {/* ------------------------------ */}
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Insights</h2>

        <div className="text-gray-700 space-y-2">
          <p className="text-lg">
            📊 More analytics will appear here soon.
          </p>

          <p className="text-base">
            Examples:
            <br />• Top 5 scanned coupons  
            <br />• Top performing shops  
            <br />• Today's scans  
            <br />• Unique vs returning customers  
          </p>
        </div>
      </div>

    </div>
  );
}
