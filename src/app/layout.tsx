import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexWatch — AI Video Analytics for Smart Cities",
  description:
    "AI-powered video analytics that turns your city's existing CCTV network into a real-time alert system — detecting incidents in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
