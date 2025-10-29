"use client"
import { Editor } from "@monaco-editor/react"
import { useEffect } from "react"

export default function Submission({ code } : { code : string }){
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