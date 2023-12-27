"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { RecoilRoot } from "recoil";
import { SessionProvider } from "next-auth/react";
// import { NextUIProvider } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionProvider>
        <RecoilRoot>
          {/* <NextUIProvider> */}
          <body className={inter.className}>{children}</body>
          {/* </NextUIProvider> */}
        </RecoilRoot>
      </SessionProvider>
    </html>
  );
}
