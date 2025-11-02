"use client";

import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function Submission() {
  const { submissionId } = useParams();
  const [code, setCode] = useState<string>("");
  const [languageId, setLanguageId] = useState<number>(54); // default: cpp
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.get(`/questions/submission/${submissionId}`, {
          withCredentials: true,
        });

        setCode(resp.data?.code || "");
        setLanguageId(resp.data?.languageId || 54);
      } catch (err: unknown) {
        console.error(err);
        setError("Failed to fetch submission data.");
      } finally {
        setLoading(false);
      }
    })();
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

  if (loading) {
    return (
      <div className="p-6 flex flex-col gap-4 items-center">
        <div className="w-3/4">
          <Skeleton className="h-8 w-1/4 mb-2" /> {/* title placeholder */}
          <Skeleton className="h-[80vh] w-full rounded-lg" /> {/* editor placeholder */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-semibold mb-4 text-white">
        Submission #{submissionId}
      </h1>

      <Editor
        height="80vh"
        width="90%"
        value={code}
        language={getLanguageFromId(languageId)}
        options={{
          readOnly: true,
          domReadOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: "on",
        }}
        theme="vs-dark"
      />
    </div>
  );
}