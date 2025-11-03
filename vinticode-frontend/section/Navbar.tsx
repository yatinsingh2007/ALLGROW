"use client";
import React, { useState } from "react";
import { Menu, MenuItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      className={cn("fixed top-6 inset-x-0 max-w-6xl mx-auto z-50 px-4", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Home" href="/" />
        <MenuItem setActive={setActive} active={active} item="Learn">
          <div className="text-sm grid gap-3 p-4 text-black bg-white rounded-2xl">
            <Link href="/learn/roadmap" className="hover:text-blue-500">
              Roadmap — build DSA intuition step by step
            </Link>
            <Link href="/learn/algorithms" className="hover:text-blue-500">
              Algorithm Intuition — patterns, invariants, and strategies
            </Link>
            <Link href="/practice" className="hover:text-blue-500">
              Practice Labs — deliberate drills with intuition checks
            </Link>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Resources">
          <div className="text-sm grid gap-3 p-4 text-black bg-white rounded-2xl">
            <Link href="/blog" className="hover:text-blue-500">
              Blog — mental models, heuristics, and problem breakdowns
            </Link>
            <Link href="/guides" className="hover:text-blue-500">
              Guides — DSA playbooks, cheatsheets, and review checklists
            </Link>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="About">
          <div className="p-4 text-sm text-black bg-white rounded-2xl max-w-sm">
            <p>
              VintiCode helps you grow real DSA intuition — recognizing patterns,
              spotting invariants, and reasoning from first principles — so you
              can solve new problems with confidence.
            </p>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}

