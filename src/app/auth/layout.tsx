// ----------------------------------------------------------
// File: auth/layout.tsx
// Author: Daniel Aquino Santiago
// Description: Secondary layout for authenticated users. It includes a sidebar and a header.
// ----------------------------------------------------------

"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import '../globals.css';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function SecondaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-zinc-950">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-zinc-900 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 sm-max:inline-flex hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6 text-zinc-400" />
            </Button>
            <Header onToggleSidebar={toggleSidebar} />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
