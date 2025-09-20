"use client"
import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { useRouter } from "next/navigation";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import Navbar from "@/section/Navbar";
export default function BackgroundLinesDemo() {
  const router = useRouter();
  return (
  <>
    <Navbar className="top-2 bg-transparent text-white" />
    <BackgroundLines className="flex items-center justify-center w-full flex-col p-4 bg-black">
      {/* Hero Section */}
      <h1 className="bg-clip-text text-center text-gray-200 text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Welcome To <br /> Allgrow
      </h1>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-gray-300 text-center">
        Build a rock-solid foundation in problem solving and logic before stepping into the world of Data Structures and Algorithms.
      </p>
      <TypingAnimation className="text-white">
        Exclusively in Python
      </TypingAnimation>
      <InteractiveHoverButton
        className="mt-6 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          router.push("/auth");
        }}
      >
       Start Coding
      </InteractiveHoverButton>
    </BackgroundLines>
    <footer className="w-full bg-transparent text-gray-400 text-center py-4 text-sm absolute bottom-0 left-0 right-0">
        &copy; {new Date().getFullYear()} Allgrow. All rights reserved.
    </footer>
  </>
  );
}
