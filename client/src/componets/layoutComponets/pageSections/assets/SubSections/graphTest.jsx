import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Maximize2, Minimize2 } from "lucide-react"; // ✅ nice icons

export default function CurveGraph({ data1, data2 }) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // 📊 Fallback demo data if none provided
  const chartData1 =
    data1 && data1.length
      ? data1
      : [
          { date: "2025-10-01", value: 12000 },
          { date: "2025-10-05", value: 13500 },
          { date: "2025-10-10", value: 14000 },
          { date: "2025-10-15", value: 15500 },
          { date: "2025-10-20", value: 15000 },
          { date: "2025-10-25", value: 16000 },
          { date: "2025-10-30", value: 1000 },
          { date: "2025-11-05", value: 6000 },
          { date: "2025-11-10", value: -1000 },
        ];

  const chartData2 =
    data2 && data2.length
      ? data2
      : [
          { date: "2025-10-01", value: 9000 },
          { date: "2025-10-05", value: 11000 },
          { date: "2025-10-10", value: 12500 },
          { date: "2025-10-15", value: 13000 },
          { date: "2025-10-20", value: 12500 },
          { date: "2025-10-25", value: 14500 },
          { date: "2025-10-30", value: 2000 },
          { date: "2025-11-05", value: 5000 },
          { date: "2025-11-10", value: -2000 },
        ];

  // ✅ Merge by date
  const mergedData = chartData1.map((item, i) => ({
    date: item.date,
    value1: item.value,
    value2: chartData2[i]?.value ?? 0,
  }));

  return (
    <div
      style={{
        position: isFullScreen ? "fixed" : "relative",
        top: isFullScreen ? 0 : "auto",
        left: isFullScreen ? 0 : "auto",
        width: isFullScreen ? "100vw" : "100%",
        height: isFullScreen ? "100vh" : "100%",
        background: "white",
        borderRadius: isFullScreen ? "0" : "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: "1rem",
        zIndex: isFullScreen ? 9999 : "auto",
      }}
    >
      {/* 🔘 Maximize / Minimize button */}
      <button
        onClick={() => setIsFullScreen((prev) => !prev)}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "rgba(0,0,0,0.05)",
          border: "none",
          borderRadius: "8px",
          padding: "6px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        title={isFullScreen ? "Minimize" : "Maximize"}
      >
        {isFullScreen ? (
          <Minimize2 size={18} color="#333" />
        ) : (
          <Maximize2 size={18} color="#333" />
        )}
      </button>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={mergedData}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#666" }}
            tickMargin={10}
            axisLine={{ stroke: "#ddd" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#666" }}
            axisLine={{ stroke: "#ddd" }}
            tickMargin={5}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#4F46E5", fontWeight: "bold" }}
          />
          <Legend verticalAlign="top" height={30} />

          <defs>
            <linearGradient id="lineGradient1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
            </linearGradient>

            <linearGradient id="lineGradient2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          {/* Line 1 */}
          <Line
            type="monotone"
            dataKey="value1"
            name="Standalone"
            stroke="url(#lineGradient1)"
            strokeWidth={3}
            dot={{ r: 4, stroke: "#4F46E5", strokeWidth: 1.5, fill: "#fff" }}
            activeDot={{ r: 6, fill: "#4F46E5" }}
          />

          {/* Line 2 */}
          <Line
            type="monotone"
            dataKey="value2"
            name="Consolidated"
            stroke="url(#lineGradient2)"
            strokeWidth={3}
            dot={{ r: 4, stroke: "#22C55E", strokeWidth: 1.5, fill: "#fff" }}
            activeDot={{ r: 6, fill: "#22C55E" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
