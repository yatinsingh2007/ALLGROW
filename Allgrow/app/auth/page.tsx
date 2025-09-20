"use client"
import { useState } from "react";
import Login from "@/section/Login";
import Signup from "@/section/Signup";
import { MoveLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { GridBeams } from "@/components/ui/grid-beams";

export default function ShineBorderDemo() {
  const [activeTab, setActiveTab] = useState("signup");
  const router = useRouter();

  return (
    <>
      <div onClick={() => router.push('/')} className="absolute top-5 left-5 p-2 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700 transition">
        <MoveLeftIcon className="text-white"/>
      </div>
      <GridBeams className="flex items-center justify-center w-full h-screen p-4 flex-col">
      {/* Tab Switcher */}
      <div onClick={() => router.push('/')} className="absolute top-5 left-5 p-2 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700 transition">
        <MoveLeftIcon className="text-white"/>
      </div>
      <div className="flex w-full max-w-[350px] rounded-lg overflow-hidden border border-gray-700 mb-10 ml-8">
        <button
          onClick={() => setActiveTab("signup")}
          className={`flex-1 py-2 text-sm font-bold transition-all duration-300 ${
            activeTab === "signup"
              ? "bg-white text-black"
              : "bg-black text-gray-300 hover:bg-gray-900"
          }`}
        >
          Sign Up
        </button>
        <button
          onClick={() => setActiveTab("login")}
          className={`flex-1 py-2 text-sm font-bold transition-all duration-300 ${
            activeTab === "login"
              ? "bg-white text-black"
              : "bg-black text-gray-300 hover:bg-gray-900"
          }`}
        >
          Login
        </button>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800 flex justify-center">
        {activeTab === "login" ? <Login /> : <Signup />}
      </div>
      </GridBeams>
    </>
  );
}
