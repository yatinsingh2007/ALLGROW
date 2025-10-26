"use client";

import { useEffect, useState } from "react";
import { ProtectedRouteProvider } from "@/context/ProtectedRoute";
import CalendarHeatmap, { ReactCalendarHeatmapValue, TooltipDataAttrs } from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";
import api from '@/lib/axios';

interface Value {
  date: string;
  count: number;
}

export default function Profile() {
  const [values, setValues] = useState<Value[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get<Value[]>('/userprofile/heat-map-details', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedValues = response.data.map(v => ({
          ...v,
          date: v.date,
        }));

        setValues(formattedValues);
      } catch (err) {
        console.error("Failed to fetch heatmap data:", err);
      }
    })();
  }, []);

  return (
    <ProtectedRouteProvider>
      <main className="p-4">
        <h1 className="text-xl font-semibold mb-4 text-white">Your Streak</h1>

        <CalendarHeatmap
          startDate={new Date("2025-01-01")}
          endDate={new Date()}
          values={values}
          classForValue={(value) => {
            if (!value || value.count === 0) return "color-empty";
            if (value.count >= 4) return "color-scale-4";
            if (value.count >= 3) return "color-scale-3";
            if (value.count >= 2) return "color-scale-2";
            return "color-scale-1";
          }}
          tooltipDataAttrs={(value: ReactCalendarHeatmapValue<Value> | undefined): TooltipDataAttrs => ({
            "data-tooltip-id": "heatmap-tooltip",
            "data-tooltip-content": value?.date
              ? `${value.date}: ${value.count} solved`
              : "No activity",
          })}
          showWeekdayLabels
        />

        {/* Tooltip */}
        <Tooltip id="heatmap-tooltip" />
      </main>
    </ProtectedRouteProvider>
  );
}
