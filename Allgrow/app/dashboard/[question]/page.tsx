"use client"
import Editor from "@monaco-editor/react"
import { useParams } from "next/navigation"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { useState } from "react"
import { Meteors } from "@/components/ui/meteors"
import  ProtectRouteProvider  from "@/context/ProtectedRoute"

export default function Dashboard() {
  const [language, setLanguage] = useState<string>("python")
  const [output, setOutput] = useState<string>("")
  const [customInput, setCustomInput] = useState<string>("")
  const { question } = useParams()

  const handleRun = () => {
    setOutput(
      `Running ${language} code...\nInput:\n${customInput || "(no input)"}\n\nOutput:\nHello World!`
    )
  }

  return (
    <>
      <ProtectRouteProvider>
      <Meteors />
      <PanelGroup direction="horizontal">
        <Panel>
          <div className="p-4 text-white">
            <h1 className="text-2xl font-bold mb-2">{question}</h1>
            <p className="text-gray-400">Here goes your problem description...</p>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-700" />
        <Panel>
          <div className="flex flex-col h-screen bg-[#0f0f0f]">
            <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-gray-700">
              <select
                className="bg-[#1e1e1e]/80 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                onChange={(e) => setLanguage(e.target.value)}
                value={language}
              >
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
              </select>

              <button
                onClick={handleRun}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Run
              </button>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
              />
            </div>
            <div className="h-60 flex flex-col bg-black border-t border-gray-700">
              <div className="p-3 border-b border-gray-700">
                <label className="block text-gray-400 mb-1">Custom Input:</label>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter input for your program..."
                  className="w-full bg-[#1e1e1e] text-white p-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex-1 p-3 text-green-400 font-mono text-sm overflow-auto">
                <label className="block text-gray-400 mb-1">Output:</label>
                <pre>{output || "Output will appear here..."}</pre>
              </div>
            </div>
          </div>
        </Panel>
      </PanelGroup>
      </ProtectRouteProvider>
    </>
  )
}
