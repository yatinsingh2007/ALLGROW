"use client"
import { Editor } from "@monaco-editor/react"
import { useEffect, useState } from "react"
import api from '@/lib/axios'
import { useParams } from "next/navigation"

export default function Submission(){
    const { submissionId } = useParams();
    const [code , setCode] = useState<string>('');
    const [languageId , setLanguageId] = useState<number>(73)
    useEffect(() => {
        (async() => {
            try{
                const resp = await api.get(`/questions/submission/${submissionId}` , {
                    withCredentials : true
                });
                setCode(resp.data?.code)
            }catch(err){
                console.log(err);
                return
            }
        })()
    } , [])
    return (
        <>
            <Editor
            height={1500}
            width={1500}
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