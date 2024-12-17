// ----------------------------------------------------------
// File: task-completion-chart.tsx
// Author: Máximo Martín Moreno
// Description: This file defines the TaskCompletionChart component,
// which fetches tasks and family data from an API and displays a bar chart.
// The chart shows the distribution of tasks by status for each family.
// ----------------------------------------------------------

'use client' // Ensure this file is treated as a client-side component

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface Task { // Define the Task interface
  id: string
  title: string
  family: string
  status: 'TODO' | 'DOING' | 'DONE' | 'PAUSED'
}

interface Family { // Define the Family interface
  id: string
  title: string
  color: string
}

export function TaskCompletionChart() { // Define the TaskCompletionChart component
  const [tasks, setTasks] = useState<Task[]>([])
  const [families, setFamilies] = useState<Family[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://127.0.0.1:8000/api/tasks/", { // GET request to fetch tasks
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (response.status !== 200) {
        throw new Error("Error fetching tasks")
      }

      setTasks(response.data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setError('Error fetching tasks. Please try again.')
    }
  }, [])

  const fetchFamilies = useCallback(async () => { // Function to fetch families
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://127.0.0.1:8000/api/family/", { // GET request to fetch families
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (response.status !== 200) {
        throw new Error("Error fetching families")
      }

      setFamilies(response.data)
    } catch (error) {
      console.error("Error fetching families:", error)
      setError('Error fetching families. Please try again.')
    }
  }, [])

  useEffect(() => { // Fetch tasks and families when the component mounts
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([getTasks(), fetchFamilies()])
      setLoading(false)
    }

    fetchData()
  }, [getTasks, fetchFamilies])

  const processData = useCallback(() => { // Function to process the data for the chart
    const statusOrder = ['TODO', 'DOING', 'PAUSED', 'DONE']
    return statusOrder.map(status => {
      const dataPoint: { [key: string]: number | string } = { status }
      families.forEach(family => {
        const tasksCount = tasks.filter(task => task.family === family.id && task.status === status).length
        dataPoint[family.id] = tasksCount
      })
      return dataPoint
    })
  }, [tasks, families])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const data = processData()

  const getColorFromTailwind = (color: string) => { // Function to get color from Tailwind CSS class
    const colorMap: { [key: string]: string } = {
      'bg-red-500': '#ef4444',
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#22c55e',
      'bg-yellow-500': '#eab308',
      'bg-purple-500': '#a855f7',
      'bg-pink-500': '#ec4899',
      'bg-indigo-500': '#6366f1',
      'bg-teal-500': '#14b8a6'
    }
    return colorMap[color] || color
  }

  return ( // Render the TaskCompletionChart component
  <Card className="bg-zinc-900">
    <CardHeader>
      <CardTitle className="text-white">Tasks by Family and Status</CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer
        config={Object.fromEntries(
          families.map(family => [
            family.id,
            {
              label: family.title,
              color: getColorFromTailwind(family.color),
            },
          ])
        )}
        className="w-full h-[300px] overflow-hidden"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="status"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            {families.map((family) => (
              <Bar
                key={family.id}
                dataKey={family.id}
                stackId="a"
                fill={getColorFromTailwind(family.color)}
                name={family.title}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>

  )
}


