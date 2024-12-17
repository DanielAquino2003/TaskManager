// ----------------------------------------------------------
// File: calendar/page.tsx
// Author: Daniel Aquino Santiago
// Description: This file defines the CalendarPage component,
// which displays a calendar view of tasks for a given month.
// The component fetches tasks and family data from an API.
// ----------------------------------------------------------

'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getTasks, getFamilies, Task, Family } from '../lib/api'
import { DayDialog } from '@/components/day-dialog'

interface CalendarDay { // Define the CalendarDay interface
  date: Date
  tasks: Task[]
  isCurrentMonth: boolean
}

const getDaysInMonth = (year: number, month: number, tasks: Task[]): CalendarDay[] => { // Define the getDaysInMonth function
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const result: CalendarDay[] = []

  const firstDayOfWeek = firstDay.getDay()
  
  for (let i = 1; i < firstDayOfWeek; i++) {
    const date = new Date(year, month, 1 - i)
    result.unshift({ date, tasks: [], isCurrentMonth: false })
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const dayTasks = tasks.filter(task => new Date(task.fecha).toDateString() === date.toDateString())
    result.push({ date, tasks: dayTasks, isCurrentMonth: true })
  }

  const daysFromNextMonth = 42 - result.length
  for (let i = 1; i <= daysFromNextMonth; i++) {
    const date = new Date(year, month + 1, i)
    result.push({ date, tasks: [], isCurrentMonth: false })
  }

  return result
}

const isToday = (date: Date) => { // Define the isToday function
  const today = new Date()
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
}

export default function CalendarPage() { // Define the CalendarPage component
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [families, setFamilies] = useState<Family[]>([])
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
  const [isDayDialogOpen, setIsDayDialogOpen] = useState(false)

  useEffect(() => { // Fetch tasks and families when the component mounts
    const fetchData = async () => {
      try {
        const [tasksData, familiesData] = await Promise.all([getTasks(), getFamilies()])
        setTasks(tasksData)
        setFamilies(familiesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        
      }
    }
    fetchData()
  }, [])

  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth(), tasks) 
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const nextMonth = () => { // Define the nextMonth function
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }
 
  const prevMonth = () => { // Define the prevMonth function
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)) 
  }

  const handleDayClick = (day: CalendarDay) => { // handleDayClick function , for handling day click
    setSelectedDay(day)
    setIsDayDialogOpen(true)
  }

  return ( // Return the JSX for the CalendarPage component
    <div className="bg-zinc-900 rounded-xl p-2 sm:p-4 lg:p-6 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)] overflow-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-0">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="default" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="default" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-4">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center text-[0.6rem] sm:text-xs lg:text-sm font-medium text-zinc-400 py-1 lg:py-2">
            {day}
          </div>
        ))}

        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              "aspect-square p-0.5 sm:p-1 lg:p-2 rounded-lg cursor-pointer transition-colors duration-200",
              day.isCurrentMonth ? "bg-zinc-800 hover:bg-zinc-700" : "bg-zinc-800/50 hover:bg-zinc-700/50",
              isToday(day.date) && "bg-blue-1000 ring-1 sm:ring-2 ring-orange-400 hover:bg-orange-500",
              "flex flex-col gap-0.5 sm:gap-1"
            )}
            onClick={() => handleDayClick(day)}
          >
            <span className={cn(
              "text-[0.6rem] sm:text-xs lg:text-sm font-medium",
              day.isCurrentMonth ? "text-white" : "text-zinc-500",
              isToday(day.date) && "text-blue-200 font-bold"
            )}>
              {day.date.getDate()}
            </span>
            <div className="flex flex-wrap gap-0.5 sm:gap-1">
              {day.tasks.slice(0, 2).map((task) => {
                const family = families.find(f => f.id === Number(task.family))
                return (
                  <Badge
                    key={task.id}
                    variant="secondary"
                    className={cn(
                      "text-[0.4rem] sm:text-[0.6rem] lg:text-xs font-medium px-0.5 sm:px-1 py-0",
                      family ? family.color : 'bg-gray-500',
                      family?.color.startsWith('bg-zinc') || family?.color.startsWith('bg-gray') ? 'text-white' : 'text-zinc-900'
                    )}
                  >
                    {task.title.length > 5 ? `${task.title.slice(0, 5)}...` : task.title}
                  </Badge>
                )
              })}
              {day.tasks.length > 2 && (
                <Badge
                  variant="secondary"
                  className="text-[0.4rem] sm:text-[0.6rem] lg:text-xs font-medium px-0.5 sm:px-1 py-0 bg-zinc-700 text-zinc-300"
                >
                  +{day.tasks.length - 2}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedDay && (
        <DayDialog
          open={isDayDialogOpen}
          onOpenChange={setIsDayDialogOpen}
          day={selectedDay.date}
          tasks={selectedDay.tasks}
          families={families}
        />
      )}
    </div>
  )
}

