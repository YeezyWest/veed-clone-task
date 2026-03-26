import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://veed-clone-task.vercel.app"),

  title: {
    default: "Veed Clone – Simple Video Editor",
    template: "%s | Veed Clone",
  },

  description:
    "A lightweight interactive video editor built with Next.js. Drag, resize, and manage media on a timeline with a smooth editing experience.",

  keywords: [
    "video editor",
    "veed clone",
    "next.js app",
    "interactive UI",
    "timeline editor",
    "react video editor",
  ],

  authors: [
    { name: "Yusuf O. Adeshina" },
  ],

  creator: "Yusuf O. Adeshina",

  openGraph: {
    title: "Veed Clone – Interactive Video Editor",
    description:
      "Drag, resize, and edit media in a simple timeline-based video editor built with Next.js.",
    url: "https://veed-clone-task.vercel.app",
    siteName: "Veed Clone",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Veed Clone – Interactive Video Editor",
    description:
      "A simple video editor with timeline and drag-and-drop built using Next.js.",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}