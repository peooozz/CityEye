import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "City Eye — AI Video Analytics for Nagpur's CCTV Network",
  description:
    "Real-time AI video analytics that turns Nagpur's CCTV network into an instant incident detection and alert system with ironclad security.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://db.onlinewebfonts.com/c/04e6981992c0e2e7642af2074ebe3901?family=Helvetica+Now+Display+Bold"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
