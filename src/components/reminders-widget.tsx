// ----------------------------------------------------------
// File: reminders-widget.tsx
// Author: Máximo Martín Moreno
// Description: This file defines the RemindersWidget component,
// which fetches and displays a list of quick reminder tasks from an API.
// ----------------------------------------------------------

"use client";  // Ensure this file is treated as a client-side component

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios";

 
interface Task { // Define the Task interface
  id: number;
  due_date: string; 
  title: string;
}

export function RemindersWidget() { // Define the RemindersWidget component
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [authError, setAuthError] = useState<string | null>(null); 

  const getTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/tasks/", { // GET request to fetch tasks
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Error fetching tasks");
      }

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setAuthError('Error fetching tasks. Please try again.');
    }
  }, []);

  useEffect(() => { // Fetch tasks when the component mounts
    getTasks();
  }, [getTasks]);

  const sortedTasks = tasks // Sort tasks by due date and select the first 5
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()) 
    .slice(0, 5);

  return ( // Render the reminders widget
    <Card className="bg-zinc-900 max-h-100 min-h-50 ">
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl text-white">Quick Reminders</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="space-y-3 lg:space-y-4">
        {authError && (
          <div className="text-red-500">{authError}</div>
        )}
        {sortedTasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-white text-sm lg:text-base">{task.title}</span>
          </div>
        ))}
      </div>
      </CardContent>
    </Card>
  )
}
