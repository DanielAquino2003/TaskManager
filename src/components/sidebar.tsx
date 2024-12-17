// ----------------------------------------------------------
// File: component/sidebar.tsx
// Author: Daniel Aquino Santiago
// Description: Component that displays the sidebar of the app with the navigation links and the family list
// ----------------------------------------------------------



"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, CheckSquare, LogOut, PlusCircle, Trash2, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreateFamilyDialog } from "@/components/family-dialog-create";
import axios from "axios";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/auth/dashboard" },
  { icon: Calendar, label: "Calendar", href: "/auth/calendar" },
  { icon: CheckSquare, label: "My Tasks", href: "/auth/tasks" },
];

interface Family {
  id: number;
  title: string;
  color?: string;
}

interface SidebarProps {
  onFamiliesUpdate?: (families: Family[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ onFamiliesUpdate, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCreateFamilyDialogOpen, setIsCreateFamilyDialogOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [families, setFamilies] = useState<Family[]>([]);

  useEffect(() => {
    const storedFamilies = localStorage.getItem("families");
    if (storedFamilies) {
      setFamilies(JSON.parse(storedFamilies));
    } else {
      fetchFamilies();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("families", JSON.stringify(families));
  }, [families]);

  const fetchFamilies = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/family/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log("Families data:", response.data);
      setFamilies(response.data);
      if (onFamiliesUpdate) {
        onFamiliesUpdate(response.data);
      }
    } catch (error) {
      console.error("Error fetching families:", error);
      setAuthError("Error fetching families. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleFamilyCreated = () => {
    fetchFamilies();
  };

  const handleDeleteFamily = async (familyId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/family/${familyId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const updatedFamilies = families.filter((family) => family.id !== familyId);
      setFamilies(updatedFamilies);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting family:", error);
      setAuthError("Error deleting family. Please try again.");
    }
  };

  const getColorClass = (index: number) => {
    const colors = ["bg-zinc-950", "bg-zinc-400", "bg-orange-300"];
    return colors[index % colors.length];
  };

  return (
    <aside className={`w-64 bg-zinc-900 text-white p-4 flex flex-col h-full fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-orange-500" />
          TaskLY
        </h1>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
  
      <nav className="space-y-2 mb-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              pathname === item.href
                ? "bg-zinc-800 text-orange-500"
                : "hover:bg-zinc-800"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
  
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-zinc-800 w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </nav>
  
      <div className="mt-12">
        <h2 className="text-sm font-semibold text-zinc-400 px-4 mb-2">Teams</h2>
        <div className="space-y-1">
          {families.map((family, index) => (
            <div key={family.id} className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${family.color || getColorClass(index)}`} />
                <span>{family.title}</span>
              </div>
              <button
                onClick={() => handleDeleteFamily(family.id)}
                className="text-zinc-400 hover:text-orange-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="default"
          onClick={() => setIsCreateFamilyDialogOpen(true)}
          className="w-full mt-2"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Team
        </Button>
      </div>
  
      <CreateFamilyDialog
        open={isCreateFamilyDialogOpen}
        onOpenChange={setIsCreateFamilyDialogOpen}
        onFamilyCreated={handleFamilyCreated}
        setAuthError={setAuthError}
      />
  
      {authError && (
        <div className="mt-4 p-2 bg-orange-500 text-white rounded">
          {authError}
        </div>
      )}
    </aside>
  );
}

