// ----------------------------------------------------------
// File: component/create-task-dialog.tsx
// Author: Daniel Aquino Santiago
// Description: This file defines the CreateTaskDialog component, which allows users to create a new task.
// ----------------------------------------------------------

"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import axios from "axios"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated: () => void
  setAuthError: (error: string) => void
}

export function CreateTaskDialog({ open, onOpenChange, onTaskCreated, setAuthError }: CreateTaskDialogProps) {
  const [status, setStatus] = useState<string>("TODO")
  const [families, setFamilies] = useState<{ id: string, title: string }[]>([])
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null)

  const titleRef = React.useRef<HTMLInputElement>(null)
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null)
  const fechaRef = React.useRef<HTMLInputElement>(null)
  const horaRef = React.useRef<HTMLInputElement>(null)
  const locationRef = React.useRef<HTMLInputElement>(null)
  const puntosDeExperienciaRef = React.useRef<HTMLInputElement>(null)

  // Cargar las familias desde la API
  const fetchFamilies = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/family/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      setFamilies(response.data)
    } catch (error) {
      console.error("Error al cargar las familias:", error)
      setAuthError("Error al cargar las familias. Intenta nuevamente.")
    }
  }

  useEffect(() => {
    fetchFamilies()
  }, )

  const handleOpenChange = (open: boolean) => {
    if (open) {
      fetchFamilies()
    }
    onOpenChange(open)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const title = titleRef.current?.value
    const description = descriptionRef.current?.value
    const fecha = fechaRef.current?.value
    const hora = horaRef.current?.value
    const location = locationRef.current?.value
    const puntosDeExperiencia = puntosDeExperienciaRef.current?.value

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "http://127.0.0.1:8000/api/tasks/",
        {
          title,
          description,
          fecha,
          hora,
          puntosDeExperiencia,
          location,
          status, // Usamos el estado de React para el valor del status
          acompanantes: [],
          family: selectedFamily, // Enviar el `id` de la familia seleccionada
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )

      console.log("response:", response.data)
      onTaskCreated()
      onOpenChange(false)
    } catch (error) {
      console.error("Error al realizar la solicitud POST:", error)
      setAuthError("Error al agregar una nueva tarea. Por favor, intente nuevamente.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-zinc-900 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" ref={titleRef} className="bg-zinc-800 border-zinc-700 text-white" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              ref={descriptionRef}
              className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Date</Label>
              <Input id="fecha" type="date" ref={fechaRef} className="bg-zinc-800 border-zinc-700 text-white" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora">Time</Label>
              <Input id="hora" type="time" ref={horaRef} className="bg-zinc-800 border-zinc-700 text-white" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" ref={locationRef} className="bg-zinc-800 border-zinc-700 text-white" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="DOING">Doing</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="puntosDeExperiencia">Experience Points</Label>
              <Input
                id="puntosDeExperiencia"
                type="number"
                ref={puntosDeExperienciaRef}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="family">Family</Label>
            <Select value={selectedFamily || ""} onValueChange={(value) => setSelectedFamily(value)}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Select Family" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                {families.map((family) => (
                  <SelectItem key={family.id} value={family.id}>
                    {family.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
