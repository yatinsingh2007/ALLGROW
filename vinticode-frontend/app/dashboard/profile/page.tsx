"use client";
import { useEffect, useState } from "react";
import { ProtectedRouteProvider } from "@/context/ProtectedRoute";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";
import api from '@/lib/axios';
interface Value {
    date: Date;
    count: number
}

export default function Profile() {
    const [values, setValues] = useState<Value[]>([])
    useEffect(() => {
        (async() => {
            const token = localStorage.getItem('token');
            const response = await api.get('/userprofile/heat-map-details' , {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });
            setValues(response.data)
        })();
    } , [])

    return (
        <ProtectedRouteProvider>
            <main className="p-4">
                <h1 className="text-xl font-semibold mb-4 text-white">Your Streak</h1>

                <CalendarHeatmap
                    startDate={new Date("2025-01-01")}
                    endDate={new Date(Date.now())}
                    values={values}
                    tooltipDataAttrs={(value) => ({
                        "data-tip": value?.date
                            ? `${value.date}: ${value.count} solved`
                            : "No activity",
                    })}
                    showWeekdayLabels
                />
                <Tooltip />
            </main>
        </ProtectedRouteProvider>
    );
}
