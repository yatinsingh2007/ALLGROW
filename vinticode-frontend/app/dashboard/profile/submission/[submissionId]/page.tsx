"use client";

import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Calendar,
  Code2,
  Clock,
} from "lucide-react";

interface SubmissionData {
  id: string;
  userId: string;
  questionId: string;
  code: string;
  status: "accepted" | "rejected";
  languageId: number;
  createdAt: string;
  updatedAt: string;
}

export default function Submission() {
  const { submissionId } = useParams();
  const router = useRouter();
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.get(`/questions/submission/${submissionId}`, {
          withCredentials: true,
        });

        setSubmissionData(resp.data);
      } catch (err: unknown) {
        console.error(err);
        setError("Failed to fetch submission data.");
      } finally {
        setLoading(false);
      }
    })();

    document.body.style.backgroundColor = "#000000";
  }, [submissionId]);

  const getLanguageFromId = (id: number): string => {
    switch (id) {
      case 54:
        return "cpp";
      case 62:
        return "java";
      case 71:
        return "python";
      case 63:
        return "javascript";
      default:
        return "plaintext";
    }
  };

  const getLanguageName = (id: number): string => {
    switch (id) {
      case 54:
        return "C++";
      case 62:
        return "Java";
      case 71:
        return "Python";
      case 63:
        return "JavaScript";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 p-4 md:p-8 overflow-x-hidden">
        <div className="mx-auto max-w-7xl w-full">
          <div className="mb-6">
            <Skeleton className="h-10 w-32 mb-4 bg-neutral-800" />
            <Skeleton className="h-6 w-48 bg-neutral-800" />
          </div>
          <Card className="border border-neutral-800 bg-neutral-900/50 w-full">
            <CardHeader>
              <Skeleton className="h-6 w-64 bg-neutral-800" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[70vh] w-full rounded-lg bg-neutral-800" />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (error || !submissionData) {
    return (
      <main className="min-h-screen bg-neutral-950 p-4 md:p-8 overflow-x-hidden flex items-center justify-center">
        <div className="mx-auto max-w-2xl w-full">
          <Card className="border border-red-800 bg-red-900/20 w-full">
            <CardContent className="p-8 text-center">
              <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                {error || "Submission not found"}
              </h2>
              <p className="text-neutral-400 mb-6">
                {error || "The submission you're looking for doesn't exist."}
              </p>
              <Button
                onClick={() => router.push("/dashboard/profile")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-4 md:p-8 overflow-x-hidden">
      <div className="mx-auto max-w-7xl w-full">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button
              onClick={() => router.push("/dashboard/profile")}
              variant="outline"
              className="border-neutral-800 bg-neutral-900/50 text-white hover:bg-neutral-800 hover:text-white mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Submission Details
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              View your code submission
            </p>
          </div>
        </div>

        {/* Submission Info Card */}
        <Card className="border border-neutral-800 bg-neutral-900/50 w-full mb-6">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  {submissionData.status === "accepted" ? (
                    <div className="flex items-center gap-2 rounded-full bg-green-500/20 border border-green-500/30 px-3 py-1">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-semibold text-green-400">
                        Accepted
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-full bg-red-500/20 border border-red-500/30 px-3 py-1">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-sm font-semibold text-red-400">
                        Rejected
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-500/30 px-3 py-1">
                  <Code2 className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">
                    {getLanguageName(submissionData.languageId)}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(submissionData.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(submissionData.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Code Editor Card */}
        <Card className="border border-neutral-800 bg-neutral-900/50 w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Code</h2>
              <span className="text-sm text-neutral-400">
                Read-only
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-lg overflow-hidden border border-neutral-800">
              <Editor
                height="70vh"
                width="100%"
                value={submissionData.code}
                language={getLanguageFromId(submissionData.languageId)}
                options={{
                  readOnly: true,
                  domReadOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: "on",
                  wordWrap: "on",
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  fontFamily: "Monaco, 'Courier New', monospace",
                }}
                theme="vs-dark"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}