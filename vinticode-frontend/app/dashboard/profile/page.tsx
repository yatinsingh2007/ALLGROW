"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  User,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Trophy,
  FileCode,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Submission {
  id: string;
  userId: string;
  questionId: string;
  code: string;
  status: "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  question : questionData
}

interface questionData {
  id: string;
  title: string;
  description: string;
  input_format: string;
  output_format: string;
  sample_input: string;
  sample_output: string;
  test_cases: [
    {
      input: string;
      output: string;
    }
  ];
  difficulty: string;
  createdAt: Date;
  updatedAt: Date;
  done : boolean
}

interface UserData {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const [profileResp, submissionsResp] = await Promise.all([
          api.get("/userprofile", { withCredentials: true }),
          api.get("/userprofile/submissions", { withCredentials: true }),
        ]);

        setUserData(profileResp.data);
        setSubmissions(submissionsResp.data);
      } catch (err : unknown) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();

    document.body.style.backgroundColor = "#000000";
  }, []);

  const acceptedCount = submissions.filter(s => s.status === "accepted").length;
  const rejectedCount = submissions.filter(s => s.status === "rejected").length;
  const acceptanceRate = submissions.length > 0 
    ? Math.round((acceptedCount / submissions.length) * 100) 
    : 0;

  return (
    <main className="min-h-screen bg-neutral-950 p-4 md:p-8 overflow-x-hidden">
      <div className="mx-auto max-w-6xl w-full">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              Profile
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Manage your profile and view your coding journey
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/home")}
            variant="outline"
            className="border-neutral-800 bg-neutral-900/50 text-white hover:bg-neutral-800 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {loading ? (
          <div className="space-y-8 w-full">
            <Card className="border border-neutral-800 bg-neutral-900/50 w-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full bg-neutral-800" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48 rounded bg-neutral-800" />
                    <Skeleton className="h-4 w-64 rounded bg-neutral-800" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32 rounded bg-neutral-800" />
              </CardContent>
            </Card>
            <div className="grid gap-6 md:grid-cols-3 w-full">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border border-neutral-800 bg-neutral-900/50 w-full">
                  <CardContent className="p-6">
                    <Skeleton className="mb-2 h-4 w-24 rounded bg-neutral-800" />
                    <Skeleton className="h-8 w-16 rounded bg-neutral-800" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="border border-neutral-800 bg-neutral-900/50 w-full">
              <CardHeader>
                <Skeleton className="h-6 w-48 rounded bg-neutral-800" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-neutral-800 bg-neutral-800/30 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded-full bg-neutral-700" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-48 rounded bg-neutral-700" />
                          <Skeleton className="h-3 w-20 rounded bg-neutral-700" />
                        </div>
                      </div>
                      <Skeleton className="h-3 w-32 rounded bg-neutral-700" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8 w-full">
            {userData && (
              <Card className="border border-neutral-800 bg-neutral-900/50 w-full">
                <CardHeader className="pb-4">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700">
                        <User className="h-8 w-8 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {userData.name}
                        </h2>
                        <div className="mt-2 flex items-center gap-2 text-neutral-400">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{userData.email}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Joined{" "}
                            {new Date(userData.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}
            <div className="grid gap-6 md:grid-cols-3 w-full">
              <Card className="border border-neutral-800 bg-neutral-900/50 w-full">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="text-sm font-medium text-neutral-300">Accepted</span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{acceptedCount}</p>
                  <p className="text-xs text-neutral-500">
                    Successful submissions
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-neutral-800 bg-neutral-900/50 w-full">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <span className="text-sm font-medium text-neutral-300">Rejected</span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{rejectedCount}</p>
                  <p className="text-xs text-neutral-500">
                    Failed submissions
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-neutral-800 bg-neutral-900/50 w-full">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    <span className="text-sm font-medium text-neutral-300">Acceptance Rate</span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{acceptanceRate}%</p>
                  <p className="text-xs text-neutral-500">
                    Success percentage
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Submissions Card */}
            <Card className="border border-neutral-800 bg-neutral-900/50 w-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 border border-neutral-700">
                      <FileCode className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Your Submissions
                      </h3>
                      <p className="text-sm text-neutral-400">
                        View all your coding submissions
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full bg-green-500/20 border border-green-500/30 px-3 py-1">
                    <span className="text-sm font-semibold text-green-400">
                      {submissions.length}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {submissions.length > 0 ? (
                  submissions.map((s) => (
                    <div
                      key={s.id}
                      role="button"
                      tabIndex={0}
                      className="rounded-lg border border-neutral-800 bg-neutral-800/30 p-4 transition-all hover:border-neutral-700 hover:bg-neutral-800/50 cursor-pointer"
                      onClick={() => router.push(`/dashboard/profile/submission/${s.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          router.push(`/dashboard/profile/submission/${s.id}`);
                        }
                      }}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          {s.status === "accepted" ? (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 ring-1 ring-green-500/30">
                              <CheckCircle2 className="h-5 w-5 text-green-400" />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20 ring-1 ring-red-500/30">
                              <XCircle className="h-5 w-5 text-red-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-white">
                              {s.question.title}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                  s.status === "accepted"
                                    ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/30"
                                    : "bg-red-500/20 text-red-400 ring-1 ring-red-500/30"
                                }`}
                              >
                                {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                              </span>
                              {s.question.difficulty && (
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                    s.question.difficulty === "Easy"
                                      ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/30"
                                      : s.question.difficulty === "Medium"
                                      ? "bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/30"
                                      : "bg-red-500/20 text-red-400 ring-1 ring-red-500/30"
                                  }`}
                                >
                                  {s.question.difficulty}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-neutral-300">
                            {new Date(s.createdAt).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {new Date(s.createdAt).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800">
                      <AlertCircle className="h-8 w-8 text-neutral-500" />
                    </div>
                    <p className="text-lg font-medium text-neutral-400">
                      No submissions yet
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      Start solving problems to see your submissions here
                    </p>
                    <Button
                      onClick={() => router.push("/dashboard/home")}
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      Browse Questions
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
