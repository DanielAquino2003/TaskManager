// ----------------------------------------------------------
// File: goal-create-dialog.tsx
// Author: Máximo Martín Moreno
// Description: This file defines the CreateGoalDialog component,
// which provides a dialog interface for creating new quick tasks (goals).
// It interacts with an API to add new goals and manages user input.
// ----------------------------------------------------------


'use client'

import React, {  } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"


// Define the structure for the dialog's props

interface CreateGoalDialogProps {
  open: boolean // Whether the dialog is open
  onOpenChange: (open: boolean) => void // Function to handle dialog open state changes
  onTaskCreated: () => void // Function to handle task creation 
  setAuthError: (error: string) => void // Function to handle authentication errors
}

export function CreateGoalDialog({ open, onOpenChange, onTaskCreated, setAuthError }: CreateGoalDialogProps) { // Define the CreateGoalDialog component

  const titleRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const title = titleRef.current?.value

    console.log(title)

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post("http://127.0.0.1:8000/api/quickTasks/", { // POST request to create a new quick task
        title,
        creator: localStorage.getItem("user_id"),
        type: "MONTH"  // Aquí se agrega el tipo 'DAY' a la tarea creada
      }, {
        headers: {
          'Authorization': `Token ${token}`
        }
      })

      console.log('response:', response.data)
      onTaskCreated()
      onOpenChange(false)
    } catch (error) {
      console.error('Error al realizar la solicitud POST:', error)
      setAuthError('Error al agregar una nueva tarea. Por favor, intente nuevamente.') 
    }
  }

  return ( // Render the dialog form
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              ref={titleRef}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600"
            >
              Create Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
