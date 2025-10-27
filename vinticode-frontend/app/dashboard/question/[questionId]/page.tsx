"use client";

import Editor, { OnChange } from "@monaco-editor/react";
import { useParams } from "next/navigation";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEffect, useState } from "react";
import { ProtectedRouteProvider } from "@/context/ProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface languageDetails {
  language: string;
  id: number;
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

interface Output {
  stdout: string;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string;
  memory: number;
  token: string;
  status: {
    id: number;
    description: string;
  };
}

interface Submission {
  id: string | null;
  userId: string | null;
  questionId: string | null;
  code: string | null;
  status: "accepted" | "rejected" | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  question: questionData;
}

interface Submissions {
  submissions: Submission[];
}

export default function Dashboard() {
  const { questionId } = useParams();

  const [submissions, setSubmissions] = useState<Submissions>({
    submissions: [],
  });

  const [questionData, setQuestionData] = useState<questionData>({
    id: "",
    title: "",
    description: "",
    input_format: "",
    output_format: "",
    sample_input: "",
    sample_output: "",
    test_cases: [
      {
        input: "",
        output: "",
      },
    ],
    difficulty: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    done : false
  });

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const resp = await api.get(`/dashboard/question/${questionId}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setQuestionData(resp.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load question. Please refresh.");
      }
    })();
  }, [questionId]);

  const [language, setLanguage] = useState<languageDetails>({
    language: "python",
    id: 71,
  });
  const [fontSize, setFontSize] = useState<number>(16);
  const [output, setOutput] = useState<Output>({
    stdout: "",
    stderr: "",
    compile_output: "",
    message: "",
    time: "",
    memory: 0,
    token: "",
    status: {
      id: 0,
      description: "",
    },
  });
  const [customInput, setCustomInput] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [rloader, setRloader] = useState<boolean>(false);
  const [sloader, setSloader] = useState<boolean>(false);

  const handleRun = async () => {
    try {
      setRloader(true);
      const response = await api.post(
        `/questions/runCode/${questionData.id}`,
        {
          code,
          input: customInput,
          questionId,
          language_id: language.id,
        }
      );
      setOutput(response.data.result);
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.error || "Code execution failed");
      } else {
        toast.error("Please try running the code again");
      }
    } finally {
      setRloader(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSloader(true);
      const token = localStorage.getItem("token") || "";
      await api.post(
        `/questions/submitCode/${questionData.id}`,
        {
          code,
          questionId,
          language_id: language.id,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Code submitted successfully!");
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.error || "Submission failed");
      } else {
        toast.error("Submission failed, please try again");
      }
    } finally {
      setSloader(false);
    }
  };

  const handleCodeChange: OnChange = (value) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const languages: languageDetails[] = [
    { language: "python", id: 71 },
    { language: "cpp", id: 54 },
    { language: "java", id: 62 },
    { language: "javascript", id: 63 },
  ];

  const router = useRouter();

  return (
    <ProtectedRouteProvider>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={40}>
          <Button
            className="fixed top-2 left-2 bg-black text-white hover:bg-white hover:text-black cursor-pointer"
            onClick={() => router.push("/dashboard/home")}
          >
            Back
          </Button>
          <div className="p-6 text-white overflow-y-auto h-screen bg-[#111] pt-14">
            {questionData.title ? (
              <>
                <h1 className="text-2xl font-bold mb-2">
                  {questionData.title}
                </h1>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${questionData.difficulty === "Easy"
                      ? "bg-green-600/20 text-green-400"
                      : questionData.difficulty === "Medium"
                        ? "bg-yellow-600/20 text-yellow-400"
                        : "bg-red-600/20 text-red-400"
                    }`}
                >
                  {questionData.difficulty}
                </div>

                <p className="text-gray-300 leading-relaxed mb-4">
                  {questionData.description}
                </p>

                <h3 className="text-lg font-semibold mt-2">Input Format:</h3>
                <pre className="text-gray-400 whitespace-pre-wrap mb-3">
                  {questionData.input_format}
                </pre>

                <h3 className="text-lg font-semibold">Output Format:</h3>
                <pre className="text-gray-400 whitespace-pre-wrap mb-3">
                  {questionData.output_format}
                </pre>

                <h3 className="text-lg font-semibold">Sample Input:</h3>
                <pre className="bg-[#1a1a1a] p-3 rounded-md mb-3">
                  {questionData.sample_input}
                </pre>

                <h3 className="text-lg font-semibold">Sample Output:</h3>
                <pre className="bg-[#1a1a1a] p-3 rounded-md">
                  {questionData.sample_output}
                </pre>
              </>
            ) : (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4 bg-gray-700 rounded-md" />
                <Skeleton className="h-5 w-24 bg-gray-700 rounded-full" />
                <Skeleton className="h-24 w-full bg-gray-700 rounded-md" />
                <Skeleton className="h-6 w-40 bg-gray-700 rounded-md" />
                <Skeleton className="h-12 w-full bg-gray-700 rounded-md" />
                <Skeleton className="h-6 w-40 bg-gray-700 rounded-md" />
                <Skeleton className="h-12 w-full bg-gray-700 rounded-md" />
                <Skeleton className="h-6 w-40 bg-gray-700 rounded-md" />
                <Skeleton className="h-10 w-full bg-gray-700 rounded-md" />
                <Skeleton className="h-6 w-40 bg-gray-700 rounded-md" />
                <Skeleton className="h-10 w-full bg-gray-700 rounded-md" />
              </div>
            )}
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-700" />

        <Panel defaultSize={60}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={70}>
              <div className="flex flex-col h-full bg-[#0f0f0f]">
                <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-gray-700 gap-4">
                  <div className="flex items-center gap-3">
                    <Select
                      onValueChange={(value) => {
                        const selected = languages.find(
                          (lang) => lang.language === value
                        );
                        if (selected) setLanguage(selected);
                      }}
                      value={language.language}
                    >
                      <SelectTrigger className="w-[180px] bg-[#1e1e1e]/80 border-gray-600 text-white">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1e1e1e] text-white border-gray-700">
                        {languages.map((lang) => (
                          <SelectItem key={lang.id} value={lang.language}>
                            {lang.language.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      onValueChange={(value) => setFontSize(parseInt(value))}
                      value={fontSize.toString()}
                    >
                      <SelectTrigger className="w-[120px] bg-[#1e1e1e]/80 border-gray-600 text-white">
                        <SelectValue placeholder="Font Size" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1e1e1e] text-white border-gray-700">
                        {[12, 14, 16, 18, 20, 22, 24].map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}px
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleRun}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      {rloader ? (
                        <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Run"
                      )}
                    </Button>

                    <Button
                      onClick={handleSubmit}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      {sloader ? (
                        <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </div>
                </div>

                <Editor
                  height="100%"
                  language={language.language}
                  theme="vs-dark"
                  value={code}
                  onChange={handleCodeChange}
                  options={{
                    fontSize,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </Panel>

            <PanelResizeHandle className="h-1 bg-gray-700" />
            <Panel defaultSize={30}>
              <div className="h-full bg-black border-t border-gray-700 flex flex-col">
                <div className="p-3 border-b border-gray-700">
                  <label className="block text-gray-400 mb-1">
                    Custom Input:
                  </label>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter input..."
                    className="w-full bg-[#1e1e1e] text-white p-2 rounded-lg resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex-1 p-3 text-green-400 font-mono text-sm overflow-auto">
                  <label className="block text-gray-400 mb-1">Output:</label>
                  <pre>{output.stdout || "Output will appear here..."}</pre>
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </ProtectedRouteProvider>
  );
}