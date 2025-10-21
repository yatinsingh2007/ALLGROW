"use client"
import Editor , { OnChange } from "@monaco-editor/react"
import { useParams } from "next/navigation"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { useEffect, useState } from "react"
import  { ProtectedRouteProvider }  from "@/context/ProtectedRoute"
import api from '@/lib/axios'
import { input } from "motion/react-client"
interface languageDetails{
  language : string ,
  id : number
}

interface questionData{
  id : string ,
  title : string ,
  description : string ,
  input_format : string ,
  output_format : string ,
  sample_input : string ,
  sample_output : string ,
  test_cases : [{
    input : string ,
    output : string
  }] ,
  difficulty : string ,
  createdAt : Date ,
  updatedAt : Date
}

export default function Dashboard () {
  const { questionId } = useParams();
  console.log(questionId);
  const [questionData , setQuestionData] = useState<questionData>({
    id : "" ,
    title : "" ,
    description : "" ,
    input_format : "" ,
    output_format : "" ,
    sample_input : "" ,
    sample_output : "" ,
    test_cases : [{
      input : "" ,
      output : ""
    }] ,
    difficulty : "" ,
    createdAt : new Date() ,
    updatedAt : new Date()
  })
  useEffect( () => {
    (async () => {
      try{
        const token = localStorage.getItem('token') || ""
        const resp = await api.get(`/dashboard/question/${questionId}` , {
          headers : {
            authorization : `Bearer ${token}`
          }
        })
        setQuestionData(resp.data)
      }catch(err){
        console.error(err);
        throw new Error("Something Went Wrong")
      }
    })();
  } , [])
  const [language, setLanguage] = useState<languageDetails>({
    language : "python" ,
    id : 71
  })
  const [output, setOutput] = useState<string>("")
  const [customInput, setCustomInput] = useState<string>("")
  const [code , setCode] = useState<string>("")
  const handleRun = async () => {
    const token = localStorage.getItem('token') || ""
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
      <ProtectedRouteProvider>
      <PanelGroup direction="horizontal">
        <Panel>
          <div className="p-6 text-white overflow-y-auto h-screen bg-[#111]">
            <h1 className="text-2xl font-bold mb-2">{questionData.title}</h1>

            <div
              className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${
                questionData.difficulty === "Easy"
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

            <div className="mb-3">
              <h3 className="text-lg font-semibold text-white mb-1">Input Format:</h3>
              <p className="text-gray-400 whitespace-pre-wrap">
                {questionData.input_format}
              </p>
            </div>

            <div className="mb-3">
              <h3 className="text-lg font-semibold text-white mb-1">Output Format:</h3>
              <p className="text-gray-400 whitespace-pre-wrap">
                {questionData.output_format}
              </p>
            </div>

            <div className="mb-3">
              <h3 className="text-lg font-semibold text-white mb-1">Sample Input:</h3>
              <pre className="bg-[#1a1a1a] p-3 rounded-md text-gray-300">
                {questionData.sample_input}
              </pre>
            </div>

            <div className="mb-3">
              <h3 className="text-lg font-semibold text-white mb-1">Sample Output:</h3>
              <pre className="bg-[#1a1a1a] p-3 rounded-md text-gray-300">
                {questionData.sample_output}
              </pre>
            </div>
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
      </ProtectedRouteProvider>
    </>
  )
}
