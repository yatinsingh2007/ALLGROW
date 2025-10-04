"use client"
import Editor , { OnChange } from "@monaco-editor/react"
import { useParams } from "next/navigation"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { useState } from "react"
import { Meteors } from "@/components/ui/meteors"
import  ProtectRouteProvider  from "@/context/ProtectedRoute"
import api from '@/lib/axios'
import { input } from "motion/react-client"
interface languageDetails{
  language : string ,
  id : number
}

export default function Dashboard () {
  const { questionId } = useParams()
  const token = localStorage.getItem("token")
  const [language, setLanguage] = useState<languageDetails>({
    language : "python" ,
    id : 71
  })
  const [output, setOutput] = useState<string>("")
  const [customInput, setCustomInput] = useState<string>("")
  const [code , setCode] = useState<string>("")
  const handleRun = async () => {
    const result : string = await api.post('/dashboard/run' , {
      headers : {
        authorization : `Bearer ${token}`
      } ,
      code ,
      input ,
      questionId
    })
    setOutput(result)
    return
  }
  const handleCodeChange : OnChange = (value)  => {
    if (value !== undefined){
      setCode(value)
    }
    return
  }
  return (
    <>
      <ProtectRouteProvider>
      <Meteors />
      <PanelGroup direction="horizontal">
        <Panel>
          <div className="p-4 text-white">
            <h1 className="text-2xl font-bold mb-2">{questionId}</h1>
            <p className="text-gray-400">Here goes your problem description...</p>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-700" />
        <Panel>
          <div className="flex flex-col h-screen bg-[#0f0f0f]">
            <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-gray-700">
              <select
                className="bg-[#1e1e1e]/80 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                onChange={(e) => {
                  const option = e.target.selectedOptions[0];
                  setLanguage({
                    language: option.value,
                    id: parseInt(option.dataset.id || "0"),
                  });
                }}
                value={language?.language}
              >
                <option value="python" data-id="71">Python 3</option>
                <option value="cpp" data-id="54">C++</option>
                <option value="java" data-id="62">Java</option>
                <option value="javascript" data-id="63">JavaScript (Node.js 12)</option>
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
                language={language?.language}
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
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
