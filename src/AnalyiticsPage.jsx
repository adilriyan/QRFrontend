import React, { useEffect, useState } from "react";
import { API } from "./api/api";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  Line
} from "recharts";

function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
   const { shopId } = useParams();
const navigate=useNavigate()
  
  useEffect(() => {
    API.get(`/coupons/analytics/${shopId}`)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading Analytics...</p>;
  if (!stats) return <p>No analytics available.</p>;

  // Colors for pie chart
  const COLORS = ["#3b82f6", "#10b981"];

  const scanRedeemData = [
    { name: "Scans", value: stats.totalScans },
    { name: "Redeems", value: stats.totalRedeems }
  ];

  return (
    <div className="p-6">
     <div className="flex justify-between m-3">
        <h1 className="text-3xl font-bold mb-6">📊 Coupon Analytics (Admin Only)</h1>
          <button
            className="bg-linear-to-r from-teal-500 to-cyan-500 text-dark px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
            onClick={() => navigate(`/Shope-invoice-List/${shopId}`)}
          >
            Invoices
          </button>
     </div>
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white shadow rounded p-5 text-center border-t-4 border-teal-600">
          <h2 className="text-xl font-semibold">Total Templates</h2>
          <p className="text-4xl font-bold mt-2 text-teal-700">
            {stats.totalTemplates}
          </p>
        </div>

        <div className="bg-white shadow rounded p-5 text-center border-t-4 border-blue-600">
          <h2 className="text-xl font-semibold">Total Scans</h2>
          <p className="text-4xl font-bold mt-2 text-blue-700">
            {stats.totalScans}
          </p>
        </div>

        <div className="bg-white shadow rounded p-5 text-center border-t-4 border-green-600">
          <h2 className="text-xl font-semibold">Total Redeems</h2>
          <p className="text-4xl font-bold mt-2 text-green-700">
            {stats.totalRedeems}
          </p>
        </div>

      </div>

      {/* Graph Section */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Bar Chart */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-3">📈 Scans per Template</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.templates}>
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scanCount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-3">🥧 Scan vs Redeem Ratio</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={scanRedeemData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                dataKey="value"
              >
                {scanRedeemData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Line chart for daily scans */}
      <div className="mt-10 bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-3">📅 Daily Scans (Last 14 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.dailyScans}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Template Table */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">📄 Template Performance</h2>

        <div className="bg-white shadow rounded p-4 overflow-x-auto">
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">Template</th>
                <th className="p-3 border">Scans</th>
                <th className="p-3 border">Redeems</th>
              </tr>
            </thead>

            <tbody>
              {stats.templates.map((t, i) => (
                <tr key={i}>
                  <td className="p-3 border font-semibold">{t.title}</td>
                  <td className="p-3 border">{t.scanCount}</td>
                  <td className="p-3 border">{t.redeemCount}</td>
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
