"use client";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./global.css";

const RobotoFont = Roboto({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${RobotoFont.className}`}>
      <body>{children}</body>
    </html>
  );
}
