"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Logo, LogoIcon } from "@/components/Logo";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import ProtectRouteProvider from "@/context/ProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";

interface testCases {
  sample_input: [string];
  sample_output: [string];
}
interface Question {
  id: string;
  title: string;
  input_format: string;
  output_format: string;
  sample_input: string;
  sample_output: string;
  test_cases: testCases[];
  difficulty: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function SidebarDemo() {
  const [data, setData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token: string | null = localStorage.getItem("token");
        const resp = await api.get(`/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(resp.data);
      } catch (err) {
        console.error(err);
        toast.error("Something Went Wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-300" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-300" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-300" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-300" />
      ),
    },
  ];

  return (
    <ProtectRouteProvider>
      <div
        className={cn(
          "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-800 bg-neutral-950 md:flex-row",
          "h-screen"
        )}
      >
        {/* Sidebar */}
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {loading
                  ? Array.from({ length: 4 }).map((_, idx) => (
                      <SidebarShimmer key={idx} />
                    ))
                  : links.map((link, idx) => (
                      <SidebarLink key={idx} link={link} />
                    ))}
              </div>
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Dashboard */}
        <Dashboard data={data} loading={loading} />
      </div>
    </ProtectRouteProvider>
  );
}

/* 🔹 Sidebar shimmer loader */
const SidebarShimmer = () => (
  <div className="flex items-center space-x-2 px-2 py-2 rounded-lg">
    <Skeleton className="h-5 w-5 rounded bg-neutral-800" />
    <Skeleton className="h-4 w-20 rounded bg-neutral-800" />
  </div>
);

/* 🔹 Card shimmer loader (dark mode friendly) */
const ShimmerCard = () => (
  <div className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow animate-pulse">
    <div>
      <Skeleton className="h-5 w-3/4 mb-2 rounded bg-neutral-800" />
      <Skeleton className="h-4 w-1/2 mb-1 rounded bg-neutral-800" />
      <Skeleton className="h-4 w-1/3 rounded bg-neutral-800" />
    </div>
    <div className="mt-3 flex items-center justify-between">
      <Skeleton className="h-5 w-16 rounded-full bg-neutral-800" />
      <Skeleton className="h-4 w-12 rounded bg-neutral-800" />
    </div>
  </div>
);

interface DashboardProps {
  data: Question[];
  loading: boolean;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-900 text-green-200";
    case "medium":
      return "bg-yellow-900 text-yellow-200";
    case "hard":
      return "bg-red-900 text-red-200";
    default:
      return "bg-neutral-800 text-neutral-300";
  }
};

/* 🔹 Dashboard with infinite shimmer if no questions */
const Dashboard: React.FC<DashboardProps> = ({ data, loading }) => {
  const router = useRouter();
  return (
    <div className="flex flex-1">
      <div className="grid h-full w-full flex-1 grid-cols-1 gap-4 rounded-tl-2xl border border-neutral-800 bg-neutral-950 p-4 md:grid-cols-2 lg:grid-cols-3 md:p-8">
        {loading || data.length === 0 ? (
          // 🔥 Infinite shimmer when loading OR no data
          Array.from({ length: 9 }).map((_, idx) => <ShimmerCard key={idx} />)
        ) : (
          data.map((q) => (
            <div
              key={q.id}
              className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow hover:shadow-md transition cursor-pointer"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                router.push(`/dashboard/${q.id}`);
              }}
            >
              <div>
                <h2 className="mb-2 text-lg font-semibold text-white">
                  {q.title}
                </h2>
                <p className="text-sm text-neutral-400 line-clamp-2">
                  Input: {q.input_format}
                </p>
                <p className="text-sm text-neutral-400 line-clamp-2">
                  Output: {q.output_format}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                    q.difficulty
                  )}`}
                >
                  {q.difficulty}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
