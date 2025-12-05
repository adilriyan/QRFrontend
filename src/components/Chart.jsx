import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Chart({ data }) {
  // ------------------------------------------------------------------
  // EXPECTED DATA FOR CHART:
  // data = [
  //   { date: "Jan", scans: 45 },
  //   { date: "Feb", scans: 80 },
  //   { date: "Mar", scans: 62 },
  //   ...
  // ]
  //
  // Later you will replace with API analytics:
  // GET /analytics/scan-stats
  // ------------------------------------------------------------------

  // Dummy data for UI preview (remove when connecting backend)
  const dummyData = [
    { date: "Jan", scans: 30 },
    { date: "Feb", scans: 50 },
    { date: "Mar", scans: 80 },
    { date: "Apr", scans: 65 },
    { date: "May", scans: 95 },
  ];

  // Use provided data or fallback
  const chartData = data || dummyData;

  return (
    <div
      className="
        bg-white shadow rounded-xl p-6
        w-full h-80
      "
    >
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Monthly QR Scan Analytics
      </h2>

      {/* ------------------------------------------------------------------
           RESPONSIVE CONTAINER
           Ensures chart scales on all screen sizes
         ------------------------------------------------------------------ */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          {/* Grid lines */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* Bottom axis */}
          <XAxis dataKey="date" stroke="#666" />

          {/* Side axis */}
          <YAxis stroke="#666" />

          {/* Hover tooltip */}
          <Tooltip
            contentStyle={{ borderRadius: "10px", padding: "6px" }}
          />

          {/* Line */}
          <Line
            type="monotone"
            dataKey="scans"
            stroke="#0d9488"     // (teal-600 color)
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
