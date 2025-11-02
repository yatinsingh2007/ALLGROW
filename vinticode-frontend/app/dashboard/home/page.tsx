"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Logo, LogoIcon } from "@/components/Logo";
import { CheckCircle2 } from "lucide-react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconUserBolt,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardPagination from "@/section/Pagination";

interface TestCases {
  sample_input: string[];
  sample_output: string[];
}

interface Question {
  id: string;
  title: string;
  input_format: string;
  output_format: string;
  sample_input: string;
  sample_output: string;
  test_cases: TestCases[];
  difficulty: string;
  createdAt: Date;
  updatedAt: Date;
  done: boolean;
}

export default function SidebarDemo() {
  return <SidebarDemoInner />;
}

function SidebarDemoInner() {
  const [data, setData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard/home",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-300" />,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-300" />,
    },
    {
      label: "Logout",
      href: "/auth",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-300" />,
    },
  ];

  useEffect(() => {
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-800 bg-neutral-950 md:flex-row",
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
                : links.map((link, idx) => {
                    if (link.label === "Logout") {
                      return (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e.preventDefault();
                            localStorage.removeItem("token");
                            toast.success("Logged out successfully!");
                            router.push("/");
                          }}
                        >
                          <SidebarLink link={link} />
                        </div>
                      );
                    }
                    return <SidebarLink key={idx} link={link} />;
                  })}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <Dashboard
        data={data}
        loading={loading}
        setData={setData}
        setLoading={setLoading}
        isAuthenticated={isAuthenticated}
        token={token}
      />
    </div>
  );
}

const SidebarShimmer = () => (
  <div className="flex items-center space-x-2 px-2 py-2 rounded-lg">
    <Skeleton className="h-5 w-5 rounded bg-neutral-800" />
    <Skeleton className="h-4 w-20 rounded bg-neutral-800" />
  </div>
);

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
  setData: React.Dispatch<React.SetStateAction<Question[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated?: boolean;
  token?: string | null;
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

const Dashboard: React.FC<DashboardProps> = ({
  data,
  loading,
  setData,
  setLoading,
  isAuthenticated,
  token,
}) => {
  const [page, setPage] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!isAuthenticated || !token) return;

      try {
        const resp = await api.get(`/dashboard/home?offset=${(page - 1) * 9}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(resp.data);
      } catch (err : unknown) {
        console.error(err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, token, page, setData, setLoading]);

  return (
    <div className="flex flex-1">
      <div className="grid h-full w-full flex-1 grid-cols-1 gap-4 rounded-tl-2xl border border-neutral-800 bg-neutral-950 p-4 md:grid-cols-2 lg:grid-cols-3 md:p-8">
        {loading || data.length === 0
          ? Array.from({ length: 9 }).map((_, idx) => <ShimmerCard key={idx} />)
          : data.map((q) => (
              <div
                key={q.id}
                className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow hover:shadow-md transition cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/dashboard/question/${q.id}`);
                }}
              >
                <div className="relative">
                  {q.done && (
                    <CheckCircle2 className="text-green-500 w-5 h-5 mb-1 absolute top-1 right-1" />
                  )}
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
            ))}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
          <DashboardPagination
            totalPages={10}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};
