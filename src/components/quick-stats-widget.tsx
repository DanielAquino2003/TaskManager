// ----------------------------------------------------------
// File: quick-stats-widget.tsx
// Author: Máximo Martín Moreno
// Description: This file defines the QuickStatsWidget component,
// which fetches tasks and displays quick statistics such as
// the number of completed tasks, remaining tasks, active tasks,
// the time margin from the last task, and the completion percentage.
// ----------------------------------------------------------


'use client' // Ensures this file is treated as a client-side component

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from 'axios'


interface Task {
  id: number
  title: string
  status: 'TODO' | 'DOING' | 'DONE' | 'PAUSED'
  date: string // Fecha de creación de la tarea
}

export function QuickStatsWidget() { // Define the QuickStatsWidget component
  const [tasks, setTasks] = useState<Task[]>([]) 
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    tasksRemaining: 0,
    tasksActive: 0,
    marginDays: 0,
    completionPercentage: 0,
  })

  // Fetch tasks when the component mounts
  useEffect(() => { 
    const getTasks = async () => {
      try {
        const token = localStorage.getItem("token") 
        const response = await axios.get("http://127.0.0.1:8000/api/tasks/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (response.status === 200) {
          setTasks(response.data)
        }
      } catch (error) {
        console.error("Error fetching tasks:", error)
      }
    }

    getTasks()
  }, [])


  useEffect(() => { // Update the stats when tasks change
    if (tasks.length > 0) {
      const tasksCompleted = tasks.filter((task) => task.status === 'DONE').length // Filter tasks by status
      const tasksRemaining = tasks.filter((task) => task.status !== 'DONE').length 
      const tasksActive = tasks.filter((task) => task.status !== 'PAUSED').length 


      const taskDates = tasks.map((task) => new Date(task.date)) 
      const latestTaskDate = new Date(Math.max(...taskDates.map(date => date.getTime()))) 
      const currentDate = new Date()


      const marginDays = latestTaskDate.getTime() ? (currentDate.getTime() - latestTaskDate.getTime()) / (1000 * 3600 * 24) : 0


      const completionPercentage = (tasksCompleted / tasks.length) * 100

      setStats({ // Update the stats state
        tasksCompleted,
        tasksRemaining,
        tasksActive,
        marginDays: marginDays || 0, 
        completionPercentage: isNaN(completionPercentage) ? 0 : completionPercentage, 
      })
    }
  }, [tasks])

  return ( // Render the QuickStatsWidget component
    <Card className="bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl text-white">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 lg:gap-4">
          <div className="text-center">
            <p className="text-xl lg:text-2xl font-bold text-orange-500">{stats.completionPercentage.toFixed(1)}%</p>
            <p className="text-xs lg:text-sm text-zinc-400">Tasks Completed</p>
          </div>
          <div className="text-center">
            <p className="text-xl lg:text-2xl font-bold text-orange-500">{stats.tasksRemaining}</p>
            <p className="text-xs lg:text-sm text-zinc-400">Tasks Remaining</p>
          </div>
          <div className="text-center">
            <p className="text-xl lg:text-2xl font-bold text-orange-500">{stats.tasksActive}</p>
            <p className="text-xs lg:text-sm text-zinc-400">Tasks Active</p>
          </div>
          <div className="text-center">
            <p className="text-xl lg:text-2xl font-bold text-orange-500">{stats.marginDays.toFixed(1)}d</p>
            <p className="text-xs lg:text-sm text-zinc-400">Time Margin (Last Task to Today)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
