import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { H3 } from "../../../../singleComponets/heading/heading";
import Image from "../../../../singleComponets/image/image";

import styleCurve from "./s2curve.module.css";
import imgStyle from "../../../../singleComponets/image/image.module.css";

export default function S2CurveGraph({
  categoryData,
  flag = 1,
  isFullScreen = "false",
}) {

  if (!categoryData) return null;
  const { categoryName, standalone = [], consolidated = [] } = categoryData;
  const dataType =
    flag === 1 ? "currentValue" : flag === 2 ? "PL" : "PLpercent";
  const curveName = flag === 1 ? "Current Value" : flag === 2 ? "P/L" : "P/L %";
  const chartData1 =
    standalone.length > 0
      ? standalone.map((d) => ({
          date: new Date(d.date).toLocaleDateString("en-IN").split("T")[0],
          value: d[dataType] ? Number(d[dataType].toFixed(2)) : 0,
        }))
      : [];

  const chartData2 =
    consolidated.length > 0
      ? consolidated.map((d) => ({
          date: new Date(d.date).toLocaleDateString("en-IN").split("T")[0],
          value: d[dataType] ? Number(d[dataType].toFixed(2)) : 0,
        }))
      : [];

  const mergedData = chartData1.map((item, i) => ({
    date: item.date,
    value1: item.value,
    value2: chartData2[i]?.value ?? 0,
  }));

  return (
    <div
      className={`${
        isFullScreen === "true"
          ? styleCurve.fullScreenCurveDiv
          : styleCurve.categoryCurveDiv
      } ${flag === 3 ? styleCurve.hide : ""}`}
      dis={flag === 3 ? "yes" : ""}>
      <div className={`${styleCurve.categoryCurveSub}`}>
        <H3>
          {categoryName || "Category"} - {curveName}
        </H3>
        {isFullScreen === "true" ? (
          ""
        ) : (
          <Image
            className={imgStyle.subimg}
            src="/assets/medias/images/maximize.png"
            alt="Maximize"
            title="Maximize"
            onClick={() =>
              window.open(`/assets/chart/${categoryName}/${flag}`, "_blank")
            }
          />
        )}
      </div>
      <div className={`${styleCurve.categoryCurveSubD}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#000000" }}
              tickMargin={10}
              axisLine={{ stroke: "#000000" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#000000" }}
              axisLine={{ stroke: "#000000" }}
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

            {/* Standalone Line */}
            <Line
              type="monotone"
              dataKey="value1"
              name="Standalone"
              stroke="url(#lineGradient1)"
              strokeWidth={3}
              dot={{ r: 4, stroke: "#4F46E5", strokeWidth: 1.5, fill: "#fff" }}
              activeDot={{ r: 6, fill: "#4F46E5" }}
            />

            {/* Consolidated Line */}
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
    </div>
  );
}
