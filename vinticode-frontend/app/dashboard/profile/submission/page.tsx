"use client"
import { Editor } from "@monaco-editor/react"
interface props{
    code : string
}
export default function Submission({ code } : props){
    return (
        <>
            <Editor
            height={100}
            width={100}
            value={code}
            options={{
                readOnly : true ,
                domReadOnly : true ,
                minimap : {
                    enabled : false
                }
            }}
            theme="vs-dark"
            />
        </>
    )
}