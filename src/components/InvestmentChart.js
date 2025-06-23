"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const formatYAxis = (tickItem) => {
  if (tickItem >= 1000000) return `${tickItem / 1000000}M`;
  return new Intl.NumberFormat("hu-HU").format(tickItem);
};

export function InvestmentChart({ data, assetTypes }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...data]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((snapshot) => {
        const dataPoint = {
          // --- ITT A JAVÍTÁS ---
          date: new Date(snapshot.date).toLocaleDateString("hu-HU", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit", // Hozzáadtuk a napot
          }),
          Összesen: snapshot.assets.reduce(
            (sum, asset) => sum + asset.value,
            0
          ),
        };
        snapshot.assets.forEach((asset) => {
          dataPoint[asset.name] = asset.value;
        });
        return dataPoint;
      });
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" tickFormatter={formatYAxis} />
        <Tooltip
          formatter={(value) => new Intl.NumberFormat("hu-HU").format(value)}
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #4b5563",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="Összesen"
          stroke="#FFFFFF"
          strokeWidth={3}
          dot={false}
        />
        {assetTypes.map((asset) => (
          <Line
            key={asset.id}
            type="monotone"
            dataKey={asset.name}
            name={asset.name}
            stroke={asset.color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}