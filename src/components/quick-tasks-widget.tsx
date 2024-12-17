// ----------------------------------------------------------
// File: quick-tasks-widget.tsx
// Author: Máximo Martín Moreno
// Description: This file defines the QuickTasksWidget component,
// which fetches and displays quick tasks from an API. It allows 
// users to create, select, and delete tasks dynamically.
// ----------------------------------------------------------

'use client'; // Ensure this file is treated as a client-side component

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateQuickTaskDialog } from "./QuickTask-create-dialog";

interface QuickTask {
  id: number;
  title: string;
  completed: boolean; // Estado de la tarea
  type: string; // Tipo de la tarea: "DAY" o "MONTH"
}

export function QuickTasksWidget() { // Define the QuickTasksWidget component
  const [quickTasks, setQuickTasks] = useState<QuickTask[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set()); 
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchQuickTasks = async () => { // Function to fetch quick tasks
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/quickTasks/", { // GET request to fetch quick tasks
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const filteredTasks = response.data.filter((task: QuickTask) => task.type === "DAY");
      setQuickTasks(filteredTasks);
    } catch (err) {
      console.error("Error fetching Quick Tasks:", err);
      setError("Failed to fetch Quick Tasks. Please try again.");
    }
  };

  useEffect(() => { // Fetch quick tasks when the component mounts
    fetchQuickTasks();
  }, []);

  const handleTaskCreated = () => { // Function to handle task creation
    fetchQuickTasks(); 
  };


  const handleTaskSelection = (taskId: number) => { // Function to handle task selection
    setSelectedTasks((prevSelectedTasks) => {
      const updatedSelectedTasks = new Set(prevSelectedTasks);
      if (updatedSelectedTasks.has(taskId)) {
        updatedSelectedTasks.delete(taskId);
      } else {
        updatedSelectedTasks.add(taskId);
      }
      return updatedSelectedTasks;
    });
  };


  const handleDeleteSelectedTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      
      for (const taskId of selectedTasks) { // Delete selected tasks
        await axios.delete(`http://127.0.0.1:8000/api/quickTasks/${taskId}/`, {  // DELETE request to delete a quick task
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      }

      setSelectedTasks(new Set()); 
      fetchQuickTasks(); 
    } catch (error) {
      console.error("Error deleting tasks:", error);
      setError("Failed to delete selected tasks. Please try again.");
    }
  };

  return ( // Render the QuickTasksWidget component
    <Card className="bg-zinc-900">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg lg:text-xl text-white">Quick Tasks</CardTitle>
        <Button
          size="sm"
          variant="default"
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 text-sm mb-2">
            {error}
          </div>
        )}
        <ul className="space-y-2 lg:space-y-3">
          {quickTasks.length > 0 ? (
            quickTasks.map((task) => (
              <li key={task.id} className="flex items-center text-white">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedTasks.has(task.id)} 
                  onChange={() => handleTaskSelection(task.id)} 
                />
                <span
                  className={`text-sm lg:text-base ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.title}
                </span>
              </li>
            ))
          ) : (
            <li className="text-white text-sm lg:text-base">
              No quick tasks available.
            </li>
          )}
        </ul>

        {selectedTasks.size > 0 && (
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={handleDeleteSelectedTasks} 
              className="bg-orange-500 hover:bg-orange-600"
            >
              Delete Selected Tasks
            </Button>
          </div>
        )}
      </CardContent>

 
      <CreateQuickTaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onTaskCreated={handleTaskCreated}
        setAuthError={setError}
      />

    </Card>
  );
}
