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
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <ProtectRouteProvider>
      <div
        className={cn(
          "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
          "h-screen"
        )}
      >
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
        <Dashboard data={data} loading={loading} />
      </div>
    </ProtectRouteProvider>
  );
}

// ✅ Refactored shimmer loaders using Skeleton
const SidebarShimmer = () => (
  <div className="flex items-center space-x-2 px-2 py-2 rounded-lg">
    <Skeleton className="h-5 w-5 rounded" />
    <Skeleton className="h-4 w-20 rounded" />
  </div>
);

const ShimmerCard = () => (
  <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-gray-50 p-5 shadow dark:border-neutral-700 dark:bg-neutral-800">
    <div>
      <Skeleton className="h-5 w-3/4 mb-2 rounded" />
      <Skeleton className="h-4 w-1/2 mb-1 rounded" />
      <Skeleton className="h-4 w-1/3 rounded" />
    </div>
    <div className="mt-3 flex items-center justify-between">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-4 w-12 rounded" />
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
      return "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200";
    case "medium":
      return "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200";
    case "hard":
      return "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200";
    default:
      return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const Dashboard: React.FC<DashboardProps> = ({ data, loading }) => {
  const router = useRouter();
  return (
    <div className="flex flex-1">
      <div className="grid h-full w-full flex-1 grid-cols-1 gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:grid-cols-2 lg:grid-cols-3 md:p-8 dark:border-neutral-700 dark:bg-neutral-900">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => <ShimmerCard key={idx} />)
        ) : data.length > 0 ? (
          data.map((q) => (
            <div
              key={q.id}
              className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-gray-50 p-5 shadow hover:shadow-md transition dark:border-neutral-700 dark:bg-neutral-800 cursor-pointer"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                router.push(`/dashboard/${q.id}`);
              }}
            >
              <div>
                <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">
                  {q.title}
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  Input: {q.input_format}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
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
                <span className="text-xs text-neutral-500">
                  {new Date(q.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-neutral-500">
            No questions found.
          </p>
        )}
      </div>
    </div>
  );
};