import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AI } from "./action";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simple gpt-4o Playground",
  description: "Simple gpt-4o Playground",
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AI>{children}</AI>
      </body>
    </html>
  );
}
