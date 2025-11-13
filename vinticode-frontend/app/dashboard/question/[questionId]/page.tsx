"use client";

import Editor, { OnChange } from "@monaco-editor/react";
import { useParams, useRouter } from "next/navigation";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEffect, useState } from "react";
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
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface languageDetails {
  language: string;
  id: number;
}

interface TestCases {
  input: string;
  output: string;
}

interface questionData {
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

export default function Dashboard() {
  const { questionId } = useParams();
  const router = useRouter();

  const [submissionOutput, setSubmissionOutput] = useState<string[]>([]);

  const [testcaseStatus, setTestcaseStatus] = useState<
    ("pending" | "loading" | "accepted" | "failed")[]
  >([]);

  const [questionData, setQuestionData] = useState<questionData>({
    id: "",
    title: "",
    description: "",
    input_format: "",
    output_format: "",
    sample_input: "",
    sample_output: "",
    test_cases: [{ input: "", output: "" }],
    difficulty: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    done: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.get(`/dashboard/question/${questionId}`, {
          withCredentials: true,
        });
        setQuestionData(resp.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load question. Please refresh.");
      }
    })();
  }, [questionId]);

  useEffect(() => {
    if (questionData.test_cases.length > 0) {
      setTestcaseStatus(questionData.test_cases.map(() => "pending"));
    }
  }, [questionData]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.get(`/questions/latestSubmission/${questionId}`, {
          withCredentials: true,
        });
        setCode(resp.data?.code);
      } catch (err) {
        console.log(err);
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

      setTestcaseStatus(testcaseStatus.map(() => "loading"));

      const resp = await api.post(
        `/questions/submitCode/${questionData.id}`,
        {
          code,
          questionId,
          language_id: language.id,
        }
      );

      setSubmissionOutput(resp.data.results);

      setTestcaseStatus(
        resp.data.results.map((r: string) =>
          r === "Accepted" ? "accepted" : "failed"
        )
      );

      toast.success("Code submitted successfully!");
    } catch (err: unknown) {
      console.error(err);

      if (axios.isAxiosError(err) && err.response?.data?.results) {
        const results = err.response.data.results;

        setSubmissionOutput(results);

        setTestcaseStatus(
          results.map((r: string) =>
            r === "Accepted" ? "accepted" : "failed"
          )
        );
      } else {
        toast.error("Submission failed!");
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

  return (
    <PanelGroup direction="horizontal">
      <Panel defaultSize={40}>
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-neutral-800 bg-[#111]/90 px-4 py-3 backdrop-blur">
          <Button
            variant="ghost"
            className="h-9 gap-2 rounded-md border border-neutral-800 bg-neutral-900/50 px-3 text-neutral-200 hover:bg-neutral-800"
            onClick={() => router.push("/dashboard/home")}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {questionData.title && (
            <div className="ml-1 flex items-center gap-2">
              <h1 className="text-base font-semibold text-white md:text-lg">
                {questionData.title}
              </h1>
              {questionData.done && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-900/60 px-2 py-0.5 text-[10px] font-medium text-green-200">
                  <CheckCircle2 className="h-3 w-3" /> Done
                </span>
              )}
            </div>
          )}
        </div>

        <div className="p-6 text-white overflow-y-auto h-[calc(100vh-48px)] bg-[#111]">
          {questionData.title ? (
            <>
              <span
                className={`${
                  questionData.difficulty === "Easy"
                    ? "bg-green-900 text-green-200"
                    : questionData.difficulty === "Medium"
                    ? "bg-yellow-900 text-yellow-200"
                    : "bg-red-900 text-red-200"
                } inline-flex rounded-full px-3 py-1 text-xs font-medium`}
              >
                {questionData.difficulty}
              </span>

              <div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
                <h3 className="text-base font-semibold text-white">Description</h3>
                <p className="mt-2 text-sm text-neutral-300">
                  {questionData.description}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
                  <h3 className="text-sm font-semibold text-white">Input Format</h3>
                  <pre className="text-xs text-neutral-300 whitespace-pre-wrap">
                    {questionData.input_format}
                  </pre>
                </div>
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
                  <h3 className="text-sm font-semibold text-white">Output Format</h3>
                  <pre className="text-xs text-neutral-300 whitespace-pre-wrap">
                    {questionData.output_format}
                  </pre>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Sample Input</h3>
                    <Button
                      variant="ghost"
                      className="h-8 rounded-md border border-neutral-800 bg-neutral-800/60 px-2 text-xs text-neutral-200"
                      onClick={() => {
                        navigator.clipboard.writeText(questionData.sample_input || "");
                        toast.success("Sample input copied");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <pre className="bg-[#1a1a1a] p-3 text-xs text-neutral-200 rounded-md">
                    {questionData.sample_input}
                  </pre>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Sample Output</h3>
                    <Button
                      variant="ghost"
                      className="h-8 rounded-md border border-neutral-800 bg-neutral-800/60 px-2 text-xs text-neutral-200"
                      onClick={() => {
                        navigator.clipboard.writeText(questionData.sample_output || "");
                        toast.success("Sample output copied");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <pre className="bg-[#1a1a1a] p-3 text-xs text-neutral-200 rounded-md">
                    {questionData.sample_output}
                  </pre>
                </div>
              </div>

              {/* ⭐ ALWAYS SHOWN TEST CASES */}
              <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
                <h3 className="text-base font-semibold text-white mb-3">Test Cases</h3>

                <div className="space-y-2">
                  {questionData.test_cases.map((testCase, index) => {
                    const status = testcaseStatus[index];

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between border border-neutral-700 rounded-md p-3 bg-neutral-800/40"
                      >
                        <div>
                          <p className="text-sm text-gray-300">
                            Test Case {index + 1}
                          </p>
                          <p className="text-xs text-gray-500">
                            Input:{" "}
                            {testCase.input.length > 15
                              ? testCase.input.slice(0, 15) + "..."
                              : testCase.input}
                          </p>
                        </div>

                        {status === "pending" && (
                          <span className="text-gray-500 text-sm">Pending</span>
                        )}

                        {status === "loading" && (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent"></span>
                        )}

                        {status === "accepted" && (
                          <span className="text-green-400 text-lg font-bold">✓</span>
                        )}

                        {status === "failed" && (
                          <span className="text-red-400 text-lg font-bold">✗</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 bg-gray-700 rounded-md" />
              <Skeleton className="h-5 w-24 bg-gray-700 rounded-md" />
              <Skeleton className="h-24 w-full bg-gray-700 rounded-md" />
              <Skeleton className="h-6 w-40 bg-gray-700 rounded-md" />
              <Skeleton className="h-12 w-full bg-gray-700 rounded-md" />
            </div>
          )}
        </div>
      </Panel>

      <PanelResizeHandle className="w-1 bg-gray-700" />

      {/* RIGHT SIDE CODE + OUTPUT */}
      <Panel defaultSize={60}>
        <PanelGroup direction="vertical">
          <Panel defaultSize={70}>
            <div className="flex flex-col h-full bg-[#0f0f0f]">
              <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-gray-700">

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
                    disabled={rloader}
                    className="bg-blue-600 text-white font-semibold disabled:opacity-70"
                  >
                    {rloader ? "Running..." : "Run"}
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    disabled={sloader}
                    className="bg-emerald-600 text-white font-semibold disabled:opacity-70"
                  >
                    {sloader ? "Submitting..." : "Submit"}
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
            <div className="h-full bg-black text-white border-t border-gray-700 p-4 overflow-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-300">Output</h3>
                <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded-full">
                  {output?.status?.description || "Idle"}
                </span>
              </div>

              <pre className="text-green-400 whitespace-pre-wrap">
                {output.stdout || "Output will appear here..."}
              </pre>

              {output.stderr && (
                <div className="mt-2 text-red-400">
                  <h4>Stderr</h4>
                  <pre>{output.stderr}</pre>
                </div>
              )}

              {output.compile_output && (
                <div className="mt-2 text-yellow-300">
                  <h4>Compile Output</h4>
                  <pre>{output.compile_output}</pre>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
}
