"use client"
import React from "react";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { useRouter } from "next/navigation";
import Navbar from "@/section/Navbar";
import BlurText from "@/components/BlurText";
import TextType from "@/components/TextType";
import { BackgroundLines } from "@/components/ui/background-lines";

export default function BackgroundLinesDemo() {
  const router = useRouter();

  return (
    <>
      <BackgroundLines className="bg-black">
        <div className="relative flex flex-col min-h-screen items-center justify-between px-6 py-8">
        <Navbar className="top-2 bg-blend-darken text-white" />

        <main className="flex flex-col items-center justify-center flex-1 text-center">
          <BlurText
            text="Welcome to VintiCode"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-5xl md:text-7xl font-bold mb-6 text-white"
          />

          <TextType
            text={`Build a rock-solid foundation in problem solving and logic before stepping into 
              the world of Data Structures and Algorithms.`}
            typingSpeed={30}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
            className="max-w-3xl text-white text-lg md:text-xl font-medium leading-relaxed p-10"
          />

          <InteractiveHoverButton
            className="mt-20 px-6 py-2 text-lg cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              router.push("/auth");
            }}
          >
            Start Coding
          </InteractiveHoverButton>
        </main>

        <footer className="w-full text-gray-400 text-center py-4 text-sm">
          &copy; {new Date().getFullYear()} VintiCode. All rights reserved.
        </footer>
      </div>
      </BackgroundLines>
    </>
  );
}
