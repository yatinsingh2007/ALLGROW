"use client"
import { ProtectedRouteProvider } from "@/context/ProtectedRoute"
export default function Profile(): React.ReactNode {
    return (
        <>
            <ProtectedRouteProvider>
                <main>

                </main>
            </ProtectedRouteProvider>
        </>
    )
}