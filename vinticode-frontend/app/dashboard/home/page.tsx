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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardPagination from "@/section/Pagination";

interface TestCases {
  sample_input: string[];
  sample_output: string[];
}

interface Question {
  id: string;
  title: string;
  description: string;
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
}) => {
  const [page, setPage] = useState<number>(1);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.get(`/dashboard/home?offset=${(page - 1) * 9}`);
        setData(resp.data);
      } catch (err: unknown) {
        console.error(err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    })();
  }, [page, setData, setLoading]);

  return (
    <div className="flex flex-1">
      <div className="h-full w-full flex-1 rounded-tl-2xl border border-neutral-800 bg-neutral-950">
        <div className="flex flex-col gap-2 border-b border-neutral-800 px-4 py-4 md:px-8 md:py-6">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold text-white md:text-2xl">Practice Questions</h2>
              <p className="text-sm text-neutral-400">Sharpen your skills with curated problems. Filter by difficulty.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-300">Difficulty</span>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger size="default" className="min-w-[140px]">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 md:p-8">
          {loading && Array.from({ length: 9 }).map((_, idx) => <ShimmerCard key={idx} />)}

          {!loading && data
            .filter((q) =>
              difficultyFilter === "all"
                ? true
                : q.difficulty.toLowerCase() === difficultyFilter
            )
            .map((q) => (
              <div
                key={q.id}
                role="button"
                tabIndex={0}
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-sm outline-none transition hover:-translate-y-0.5 hover:border-neutral-700 hover:bg-neutral-900 hover:shadow md:transition-transform"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/dashboard/question/${q.id}`);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/dashboard/question/${q.id}`);
                  }
                }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-2 flex items-center gap-2">
                    <h4 className="text-base font-semibold text-white md:text-lg line-clamp-1">{q.title}</h4>
                    {q.done && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-900/60 px-2 py-0.5 text-[10px] font-medium text-green-200 ring-1 ring-inset ring-green-800">
                        <CheckCircle2 className="h-3 w-3" /> Done
                      </span>
                    )}
                  </div>
                  <p className="mb-3 text-sm text-neutral-300 line-clamp-2">{q.description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <p className="text-xs text-neutral-400 line-clamp-2">Input: {q.input_format}</p>
                    <p className="text-xs text-neutral-400 line-clamp-2">Output: {q.output_format}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      q.difficulty
                    )}`}
                  >
                    {q.difficulty}
                  </span>
                  <span className="text-xs text-neutral-400 transition group-hover:text-neutral-300">View details →</span>
                </div>
              </div>
            ))}

          {!loading && data.filter((q) =>
            difficultyFilter === "all"
              ? true
              : q.difficulty.toLowerCase() === difficultyFilter
          ).length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 text-center">
              <p className="text-sm text-neutral-300">No questions found for this filter.</p>
              <button
                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 transition hover:border-neutral-600 hover:bg-neutral-700"
                onClick={() => setDifficultyFilter("all")}
              >
                Reset filter
              </button>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-40 w-full border-t border-neutral-800 bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
          <div className="mx-auto flex w-full items-center justify-center px-4 py-3 md:px-8">
            <DashboardPagination
              totalPages={10}
              currentPage={page}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
