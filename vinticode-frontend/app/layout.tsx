import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vinticode",
  description: "Start buliding basic intuition of DSA and code your way to mastery.",
  verification : {
    google : "49oDVt61a_BJcs7UCCP6hc30N1MUU3WU7sOC92jdL8s"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Allgrow — Practice DSA from Basics to Mastery</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
          {children}
          <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
