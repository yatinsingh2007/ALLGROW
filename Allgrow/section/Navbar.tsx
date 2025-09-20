"use client";
import React, { useState } from "react";
import { Menu, MenuItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      className={cn("fixed top-6 inset-x-0 max-w-5xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Home" />
        <MenuItem setActive={setActive} active={active} item="Learn">
          <div className="text-sm grid gap-3 p-4 text-white">
            <a href="/learn/roadmap" className="hover:text-blue-400">
              Beginner Roadmap — step-by-step coding journey
            </a>
            <a href="/learn/algorithms" className="hover:text-blue-400">
              Algorithm Basics — simple explanations of core concepts
            </a>
            <a href="/practice" className="hover:text-blue-400">
              Practice Problems — curated challenges to solve
            </a>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Resources">
          <div className="text-sm grid gap-3 p-4 text-white">
            <a href="/blog" className="hover:text-blue-400">
              Blog — insights & tips on coding and careers
            </a>
            <a href="/guides" className="hover:text-blue-400">
              Guides — free resources to boost your learning
            </a>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="About">
          <div className="p-4 text-sm text-white">
            <p>
              Allgrow is a mentorship-driven platform helping students 
              master algorithms, problem-solving, and placement skills.
            </p>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}

