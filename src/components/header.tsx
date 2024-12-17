// ----------------------------------------------------------
// File: component/header.tsx
// Author: Daniel Aquino Santiago
// Description: Component that displays the header of the app
// ----------------------------------------------------------


"use client";

import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <header className="bg-zinc-900 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-6 w-6 text-zinc-400" />
        </Button>
        <h1 className="text-xl lg:text-2xl font-bold text-white">
          Welcome {username ? username : 'Guest'}!
        </h1>
      </div>
    </header>
  );
}

