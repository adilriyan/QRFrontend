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
  const dummyData = [
    { date: "Jan", scans: 30 },
    { date: "Feb", scans: 50 },
    { date: "Mar", scans: 80 },
    { date: "Apr", scans: 65 },
    { date: "May", scans: 95 },
  ];

  const chartData = data.length > 0 ? data : dummyData;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="scanGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0d9488" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        
        <CartesianGrid 
          vertical={false}
          stroke="url(#scanGradient)" 
          strokeOpacity={0.1}
          strokeDasharray="4 4"
        />
        
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
          width={40}
        />
        
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            borderRadius: '12px',
            padding: '12px',
          }}
          labelStyle={{ color: '#f1f5f9', fontWeight: 600 }}
          itemStyle={{ color: '#e2e8f0' }}
        />
        
        <Line
          type="monotone"
          dataKey="scans"
          stroke="url(#scanGradient)"
          strokeWidth={4}
          dot={{
            stroke: '#0d9488',
            strokeWidth: 3,
            r: 6,
            fill: '#0f172a',
          }}
          activeDot={{
            r: 8,
            stroke: '#10b981',
            strokeWidth: 3,
            fill: '#0f172a',
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
