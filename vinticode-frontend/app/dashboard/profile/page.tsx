"use client";

import { useEffect, useState } from "react";
import { ProtectedRouteProvider } from "@/context/ProtectedRoute";
import api from '@/lib/axios';

interface Submission{
  id : string;
  userId : string;
  questionId : string;
  code : string;
  status : "accepted" | "rejected";
  createdAt : Date;
  updatedAt : Date
}



export default function Profile() {
  const [ submissionData , setSubmissionData ] = useState<Submission[]>([])
  useEffect(() => {
    (async() => {
      try{
        const resp = await api.get('/userprofile' , {
          withCredentials : true
        })
      }catch(err){
        console.log(err);
      }
    })()
  } , [])
  useEffect(() => {
    (async()=> {
      try{
      const resp = await api.get('' , {
        withCredentials : true
      })
      console.log(resp.data)
      }catch(err){
        console.log(err);
      }
    })()
  } , [])

  return (
    <ProtectedRouteProvider>
      <main className="p-4">


        <h3>Your Submissions</h3>
        
      </main>
    </ProtectedRouteProvider>
  );
}
