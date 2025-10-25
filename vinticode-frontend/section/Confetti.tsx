"use client"

import { useRef } from "react"

import { Confetti, type ConfettiRef } from "@/components/ui/confetti"

export function ConfettiDemo() {
  const confettiRef = useRef<ConfettiRef>(null)

  return (
    <div className="bg-background relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border">
      <Confetti
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background: "transparent",
          zIndex: 50,
        }}
      />
    </div>
  )
}
