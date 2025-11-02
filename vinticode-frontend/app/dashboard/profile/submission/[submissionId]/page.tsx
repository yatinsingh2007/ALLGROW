"use client"
import { Editor } from "@monaco-editor/react"
import { useEffect, useState } from "react"
import api from '@/lib/axios'
import { useParams } from "next/navigation"

export default function Submission(){
    const { questionId } = useParams()
    const [code , setCode] = useState<string>('');
    useEffect(() => {
        (async() => {
            try{
                const resp = await api.get(`/userprofile/submission/${questionId}`);
                setCode(resp.data)
            }catch(err){
                console.log(err);
                return
            }
        })()
    })
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