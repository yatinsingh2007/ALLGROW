"use client";
import React from "react";
import { motion , type Transition } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const transition : Transition= {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  href,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  href?: string;
}) => {
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;
  return (
    <div onMouseEnter={() => setActive(item)} onFocus={() => setActive(item)} className="relative">
      {href ? (
        <Link href={href} className="outline-none">
          <motion.span
            transition={{ duration: 0.3 }}
            className={`cursor-pointer hover:opacity-[0.9] focus:opacity-[0.9] ${isActive ? "text-blue-400" : "text-white"}`}
          >
            {item}
          </motion.span>
        </Link>
      ) : (
        <motion.span
          transition={{ duration: 0.3 }}
          className="cursor-pointer text-white hover:opacity-[0.9] focus:opacity-[0.9] outline-none"
          tabIndex={0}
        >
          {item}
        </motion.span>
      )}
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-black dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border-transparent bg-transparent shadow-input flex justify-center space-x-6 px-8 py-4 border-2 border-b-blue-900"
      role="navigation"
      aria-label="Main"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <a href={href} className="flex space-x-2">
      <Image
        src={src}
        alt={title}
        title={title}
        width={140}
        height={70}
        className="shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-sm max-w-[10rem] text-black/80 dark:text-neutral-300">
          {description}
        </p>
      </div>
    </a>
  );
};

export const HoveredLink = ({
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black"
    >
      {children}
    </a>
  );
};
