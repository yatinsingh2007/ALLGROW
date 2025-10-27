"use client";

import { useEffect, useState } from "react";
import { ProtectedRouteProvider } from "@/context/ProtectedRoute";
import api from '@/lib/axios';

interface HeatmapValue {
  date: string; // 'YYYY-MM-DD'
  count: number;
}

export default function Profile() {
  const [values, setValues] = useState<HeatmapValue[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get<HeatmapValue[]>('/userprofile/heat-map-details');
        setValues(response.data);
      } catch (err) {
        console.error("Failed to fetch heatmap data:", err);
      }
    })();
  }, []);

  return (
    <ProtectedRouteProvider>
      <main className="p-4">
        <h1 className="text-xl font-semibold mb-4 text-white">Your Streak</h1>
      </main>
    </ProtectedRouteProvider>
  );
}
