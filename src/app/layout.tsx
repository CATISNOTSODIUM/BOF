import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google'
import {Source_Code_Pro} from 'next/font/google'
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})
const source_code_pro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro'
})
export const metadata: Metadata = {
  title: "BOF Playground",
  description: "🧠 Brainf*ck with macros ✨.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${source_code_pro.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
