"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  User,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

    document.body.style.backgroundColor = "#0f172a";
  }, []);

  return (
    <main className="min-h-screen p-6 flex flex-col items-center text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-3xl mb-6">
        <h1 className="text-3xl font-bold text-center sm:text-left">
          👤 Profile & Submissions
        </h1>

        <Button
          onClick={() => router.push("/dashboard/home")}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 mt-4 sm:mt-0 px-4 py-2 rounded-lg transition-all cursor-pointer"
        >
          Home
        </Button>
      </div>

      {loading ? (
        <div className="w-full max-w-3xl space-y-8">
          <div className="bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-700">
            <div className="flex items-center mb-4">
              <Skeleton className="w-12 h-12 rounded-full mr-4" />
              <div className="space-y-2">
                <Skeleton className="w-32 h-4 rounded" />
                <Skeleton className="w-48 h-3 rounded" />
              </div>
            </div>
            <Skeleton className="w-40 h-3 rounded" />
          </div>

          <div className="bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-700 space-y-4">
            <Skeleton className="w-48 h-4 mb-6 rounded" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-700 p-4 rounded-xl flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-28 h-3 rounded" />
                    <Skeleton className="w-16 h-2 rounded" />
                  </div>
                </div>
                <Skeleton className="w-24 h-2 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {userData ? (
            <div className="w-full max-w-3xl bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-700 mb-8">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-slate-700 rounded-full mr-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{userData.name}</h2>
                  <div className="flex items-center text-slate-300 text-sm mt-1">
                    <Mail className="w-4 h-4 mr-2" />
                    {userData.email}
                  </div>
                </div>
              </div>

              <p className="text-slate-400 text-sm">
                Joined on{" "}
                {new Date(userData.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <Button onClick={() => router.push("/dashboard/profile/Solvedquestion")}
                className="bg-blue-600 hover:bg-blue-700 text-white mt-8 cursor-pointer">
                Solved Questions
              </Button>
            </div>
          ) : (
            <div className="text-slate-400">Failed to load profile.</div>
          )}

          <div className="w-full max-w-3xl bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-700 space-y-4">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🧩 Your Submissions
              <span className="bg-green-600 px-2 py-0.5 rounded text-sm font-medium">
                {submissions.length}
              </span>
            </h3>

            {submissions.length > 0 ? (
              submissions.map((s) => (
                <div
                  key={s.id}
                  className="bg-slate-700 p-4 rounded-xl flex justify-between items-center hover:bg-slate-600 transition-all"
                  onClick={() => router.push(`/dashboard/profile/submission/${s.id}`)}
                >
                  <div className="flex items-center gap-2">
                    {s.status === "accepted" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <div>
                      <p className="font-medium text-white">
                        {s.question.title}
                      </p>
                      <p
                        className={`text-sm font-medium ${s.status === "accepted"
                            ? "text-green-400"
                            : "text-red-400"
                          }`}
                      >
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">
                    {new Date(s.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2 text-slate-400 mt-10">
                <AlertCircle className="w-5 h-5" />
                <p>No submissions yet.</p>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
