"use client";

import { useEffect, useState } from "react";

interface TestCase {
  input: string;
  output: string;
}

interface Question {
  id: string;
  title: string;
  description: string;
  input_format: string;
  output_format: string;
  sample_input: string;
  sample_output: string;
  test_cases: TestCase[];
  difficulty: "easy" | "medium" | "hard"; // ✅ strict typing
  createdAt: Date;
  updatedAt: Date;
}


const DashboardPage = () => {
    const [data , setData] = useState<Question[]>([])
    useEffect(() => {
        
    } , [])
    return (
        <>

        </>
    )
}

export default DashboardPage;