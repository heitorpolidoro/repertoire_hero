import type { Metadata } from "next";
import { Inter } from "next/font/google";
// FIX: Import React to use the React.ReactNode type.
import React from "react";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import MusicPlayerWrapper from "../components/MusicPlayerWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Repertoire Hero",
  description: "An application to help musicians organize and track their practice repertoire. Users can manage songs, assign practice levels, import playlists, and view statistics on their progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        <AppProvider>
          <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
              </div>
              <MusicPlayerWrapper />
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
