"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function ConsumptionChart({ data }) {
  const chartData = useMemo(() => {
    if (data.length < 2) return [];

    const sortedData = [...data].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return sortedData
      .map((current, index) => {
        if (index === 0) return null;
        const previous = sortedData[index - 1];
        const distance = current.odometer - previous.odometer;
        if (distance <= 0) return null;

        const consumption = (current.liters / distance) * 100;
        return {
          date: new Date(current.date).toLocaleDateString("hu-HU", {
            month: "2-digit",
            day: "2-digit",
          }),
          Fogyasztás: parseFloat(consumption.toFixed(2)),
        };
      })
      .filter(Boolean);
  }, [data]);

  const tickInterval =
    chartData.length > 10 ? Math.floor(chartData.length / 10) : 0;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: 10,
          bottom: 20,
        }}
      >
        <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          stroke="#9ca3af"
          interval={tickInterval}
          angle={-30}
          textAnchor="end"
        />
        <YAxis
          stroke="#9ca3af"
          domain={["dataMin - 0.5", "dataMax + 0.5"]}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #4b5563",
          }}
          labelStyle={{ color: "#f9fafb" }}
        />
        <Line
          type="monotone"
          dataKey="Fogyasztás"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}