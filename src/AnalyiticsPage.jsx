import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "./api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { FaArrowRight, FaChartBar, FaChartPie, FaChartLine, FaTable } from "react-icons/fa";

function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { shopId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/coupons/analytics/${shopId}`)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [shopId]);

  // COLORS for dark theme charts
  const CHART_COLORS = {
    primary: "#10b981",      // emerald
    secondary: "#3b82f6",    // blue
    accent: "#f59e0b",       // amber
    danger: "#ef4444",       // red
  };

  const PIE_COLORS = ["#10b981", "#3b82f6"];

  const scanRedeemData = stats ? [
    { name: "Scans", value: stats.totalScans },
    { name: "Redeems", value: stats.totalRedeems }
  ] : [];

  // Skeleton Components
  const SkeletonCard = ({ className = "" }) => (
    <div className={`bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl p-8 animate-pulse ${className}`}>
      <div className="h-6 bg-slate-800/50 rounded-xl w-32 mb-4"></div>
      <div className="h-20 bg-slate-800/30 rounded-2xl mx-auto"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen p-8 space-y-12">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="h-12 bg-slate-800/50 rounded-3xl w-80"></div>
          <div className="flex items-center gap-4">
            <div className="h-8 bg-slate-800/30 rounded-2xl w-48"></div>
            <div className="h-12 bg-slate-800/50 rounded-3xl w-32"></div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
              <div className="h-8 bg-slate-800/50 rounded-2xl w-64 mb-8"></div>
              <div className="h-80 bg-slate-800/30 rounded-3xl"></div>
            </div>
          ))}
        </div>

        {/* Line Chart Skeleton */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
          <div className="h-8 bg-slate-800/50 rounded-2xl w-72 mb-8"></div>
          <div className="h-80 bg-slate-800/30 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-28 h-28 bg-slate-800/50 border-4 border-slate-700/50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-16 h-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-100 mb-4">No Analytics Data</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Analytics will appear here once customers start scanning your coupons.
          </p>
          <button
            className="
              bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black 
              px-10 py-4 rounded-3xl shadow-xl shadow-teal-500/40 hover:shadow-teal-500/60
              hover:scale-105 transition-all duration-300
            "
            onClick={() => navigate(-1)}
          >
            Back to Shops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 lg:px-12 lg:pb-12 space-y-12">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-100 via-teal-100 to-emerald-100 bg-clip-text text-transparent drop-shadow-2xl">
            📊 Coupon Analytics
          </h1>
          <p className="text-slate-400 mt-3 text-lg lg:text-xl max-w-2xl leading-relaxed">
            Real-time performance insights for your shop's coupon campaigns
          </p>
        </div>
        <button
          className="
            group self-start lg:self-end flex items-center gap-3 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500
            text-slate-950 font-black px-8 py-4 rounded-3xl shadow-xl shadow-teal-500/40
            hover:from-teal-600 hover:to-emerald-600 hover:shadow-teal-500/60 hover:scale-105
            transition-all duration-300 whitespace-nowrap
          "
          onClick={() => navigate(`/Shope-invoice-List/${shopId}`)}
        >
          Invoices
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Templates */}
        <div className="
          group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl 
          shadow-2xl shadow-slate-950/50 p-8 hover:shadow-emerald-500/30 hover:border-emerald-500/50
          transition-all duration-500 cursor-pointer hover:-translate-y-2
        ">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h3 className="text-slate-300 font-semibold text-lg mb-2 uppercase tracking-wide">Total Templates</h3>
          <p className="text-4xl lg:text-5xl font-black text-slate-100">{stats.totalTemplates}</p>
        </div>

        {/* Total Scans */}
        <div className="
          group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl 
          shadow-2xl shadow-slate-950/50 p-8 hover:shadow-blue-500/30 hover:border-blue-500/50
          transition-all duration-500 cursor-pointer hover:-translate-y-2
        ">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/40">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-slate-300 font-semibold text-lg mb-2 uppercase tracking-wide">Total Scans</h3>
          <p className="text-4xl lg:text-5xl font-black text-slate-100">{stats.totalScans}</p>
        </div>

        {/* Total Redeems */}
        <div className="
          group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl 
          shadow-2xl shadow-slate-950/50 p-8 hover:shadow-orange-500/30 hover:border-orange-500/50
          transition-all duration-500 cursor-pointer hover:-translate-y-2
        ">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-500/40">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-slate-300 font-semibold text-lg mb-2 uppercase tracking-wide">Total Redeems</h3>
          <p className="text-4xl lg:text-5xl font-black text-slate-100">{stats.totalRedeems}</p>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Scans per Template - Bar Chart */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-100 flex items-center gap-3">
              <FaChartBar className="text-blue-400" />
              Scans per Template
            </h3>
            <div className="w-2 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-lg"></div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.templates} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.1)" strokeDasharray="4 4" />
              <XAxis 
                dataKey="title" 
                stroke="#94a3b8" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
                tickMargin={12}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
                tickMargin={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(71, 85, 105, 0.5)',
                  borderRadius: '16px',
                }}
              />
              <Bar 
                dataKey="scanCount" 
                fill="url(#scanGradient)"
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="scanGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.9} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scan vs Redeem - Pie Chart */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-100 flex items-center gap-3">
              <FaChartPie className="text-emerald-400" />
              Conversion Ratio
            </h3>
            <div className="w-2 h-10 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full shadow-lg"></div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={scanRedeemData}
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={60}
                dataKey="value"
                nameKey="name"
              >
                {scanRedeemData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(71, 85, 105, 0.5)',
                  borderRadius: '16px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DAILY SCANS LINE CHART */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-slate-100 flex items-center gap-3">
            <FaChartLine className="text-amber-400" />
            Daily Scans Trend
          </h3>
          <div className="w-2 h-10 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full shadow-lg"></div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={stats.dailyScans} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.1)" strokeDasharray="4 4" />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              fontSize={12}
              axisLine={false}
              tickLine={false}
              tickMargin={12}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12}
              axisLine={false}
              tickLine={false}
              tickMargin={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '16px',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#f59e0b"
              strokeWidth={4}
              dot={{ stroke: "#f59e0b", strokeWidth: 3, r: 6 }}
              activeDot={{ r: 8, stroke: "#fbbf24", strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* TEMPLATES TABLE */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-slate-100 flex items-center gap-3">
            <FaTable className="text-purple-400" />
            Template Performance
          </h3>
          <div className="w-2 h-10 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full shadow-lg"></div>
        </div>
        
        <div className="overflow-x-auto rounded-3xl border border-slate-800/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
                <th className="p-6 text-left font-black text-slate-200 uppercase tracking-wider">Template</th>
                <th className="p-6 text-center font-black text-slate-200 uppercase tracking-wider">Scans</th>
                <th className="p-6 text-center font-black text-slate-200 uppercase tracking-wider">Redeems</th>
                <th className="p-6 text-center font-black text-slate-200 uppercase tracking-wider">Ratio</th>
              </tr>
            </thead>
            <tbody>
              {stats.templates.map((t, i) => (
                <tr key={i} className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors">
                  <td className="p-6 font-semibold text-slate-200 max-w-md truncate">
                    {t.title}
                  </td>
                  <td className="p-6 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-300 font-bold">
                      {t.scanCount}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300 font-bold">
                      {t.redeemCount}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-bold
                      ${t.redeemCount / t.scanCount > 0.3 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                      }
                    `}>
                      {t.scanCount > 0 ? ((t.redeemCount / t.scanCount) * 100).toFixed(1) + "%" : "0%"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
