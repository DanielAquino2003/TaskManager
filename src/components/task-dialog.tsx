// ----------------------------------------------------------
// File: component/task-dialog.tsx
// Author: Daniel Aquino Santiago
// Description: This file defines the TaskDialog component, which displays a dialog with the details of a task.
// ----------------------------------------------------------


'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, User, Trash2, Edit } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import axios from 'axios'

interface Task {
  id: string
  title: string
  fecha: string
  hora: string
  location: string
  description: string
  family: string | null
  status: 'TODO' | 'DOING' | 'DONE' | 'PAUSED'
  puntosDeExperiencia: number
}

interface TaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (id: string, newStatus: 'TODO' | 'DOING' | 'DONE' | 'PAUSED') => void
  onDelete: (id: string) => void
  onTaskUpdated: (updatedTask: Task) => void
}

interface Family {
  id: string;
  title: string;
  color: string;
}

export function TaskDialog({ task, open, onOpenChange, onStatusChange, onDelete, onTaskUpdated }: TaskDialogProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedTask, setEditedTask] = useState<Task | null>(task)
  const [families, setFamilies] = useState<Family[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setEditedTask(task)
  }, [task])

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get('http://127.0.0.1:8000/api/family/', {
          headers: { Authorization: `Token ${token}` },
        })
        
        if (response.status === 200) {
          setFamilies(response.data)
          setLoading(false)
        } else {
          throw new Error("Error fetching families")
        }
      } catch (error) {
        console.error("Error fetching families:", error)
        setLoading(false)
      }
    }

    

    fetchFamilies()
  }, [])

  if (!task || loading) return null

  const statusColors = {
    TODO: 'border-red-500',
    DOING: 'border-purple-500',
    DONE: 'border-green-500',
    PAUSED: 'border-blue-500'
  }

  const getFamilyColor = (familyId: string | null) => {
    console.log("family id: " + familyId)
    if (!familyId) return "#FFFFFF"
    const family = families.find(f => f.id === familyId)
    return family ? family.color : "#FFFFFF"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleTrashClick = () => {
    if (task?.id) {
      onDelete(task.id)
    }
  }

  const handleEditClick = () => {
    setEditedTask(task)
    setIsEditDialogOpen(true)
  }

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editedTask) return

    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(`http://127.0.0.1:8000/api/tasks/${editedTask.id}/`,
        editedTask,
        {
          headers: {
            'Authorization': `Token ${token}`,
          },
        }
      )

      onTaskUpdated(response.data)
      onOpenChange(false)
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleStatusChange = async (newStatus: 'TODO' | 'DOING' | 'DONE' | 'PAUSED') => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}/`, 
        { ...task, status: newStatus },
        {
          headers: {
            'Authorization': `Token ${token}`
          }
        }
      )
      onTaskUpdated(response.data)
      onStatusChange(task.id, newStatus)
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className={cn(
            "bg-zinc-900 border-2 p-0 max-w-lg data-[state=open]:duration-300",
            statusColors[task.status]
          )}
        >
          <div className="absolute top-12 right-1 flex flex-col gap-0" >
            <button className="inline-flex opacity-70 items-center justify-center gap-1 rounded-full text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-white bg-none hover:text-orange-500 p-2"
            onClick={handleTrashClick}>
              <Trash2 className="h-6 w-6" />
            </button>
          </div> 
          <div className='absolute top-20 right-1 flex flex-col gap-0'>
            <button className='inline-flex opacity-70 items-center justify-center gap-1 rounded-full text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-white bg-none hover:text-orange-500 p-2'
            onClick={handleEditClick}>
              <Edit className='h-6 w-6'/>
            </button>
          </div>
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                {task.title}
                <div
                  className={cn(
                    "w-4 h-4 rounded-full",
                    getFamilyColor(task.family)
                  )}
                />
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mb-8 mt-4">
              <div className="flex items-center gap-3 text-zinc-400">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(task.fecha)}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <Clock className="h-5 w-5" />
                <span>{task.hora}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <MapPin className="h-5 w-5" />
                <span>{task.location}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <User className="h-5 w-5" />
                <span>Experience Points: {task.puntosDeExperiencia}</span>
              </div>
            </div>

            <p className="text-white mb-8">
              {task.description}
            </p>

            <div className="flex gap-3">
              {task.status !== 'TODO' && (
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  onClick={() => handleStatusChange('TODO')}
                >
                  To Do
                </Button>
              )}
              {task.status !== 'DONE' && (
                <Button
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  onClick={() => handleStatusChange('DONE')}
                >
                  Finish
                </Button>
              )}
              {task.status !== 'DOING' && (
                <Button
                  className="flex-1 bg-purple-500 hover:bg-purple-600"
                  onClick={() => handleStatusChange('DOING')}
                >
                  Progress
                </Button>
              )}
              {task.status !== 'PAUSED' && (
                <Button
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                  onClick={() => handleStatusChange('PAUSED')}
                >
                  Paused
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedTask?.title}
                onChange={(e) => setEditedTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedTask?.description}
                onChange={(e) => setEditedTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Date</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={editedTask?.fecha}
                  onChange={(e) => setEditedTask(prev => prev ? { ...prev, fecha: e.target.value } : null)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hora">Time</Label>
                <Input
                  id="hora"
                  type="time"
                  value={editedTask?.hora}
                  onChange={(e) => setEditedTask(prev => prev ? { ...prev, hora: e.target.value } : null)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editedTask?.location}
                onChange={(e) => setEditedTask(prev => prev ? { ...prev, location: e.target.value } : null)}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={editedTask?.status} 
                  onValueChange={(value) => setEditedTask(prev => prev ? { ...prev, status: value as 'TODO' | 'DOING' | 'DONE' | 'PAUSED' } : null)}
                >
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
                <Label htmlFor="family">Family</Label>
                <Select 
                  value={editedTask?.family || ''} 
                  onValueChange={(value) => setEditedTask(prev => prev ? { ...prev, family: value } : null)}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="puntosDeExperiencia">Experience Points</Label>
              <Input
                id="puntosDeExperiencia"
                type="number"
                value={editedTask?.puntosDeExperiencia}
                onChange={(e) => setEditedTask(prev => prev ? { ...prev, puntosDeExperiencia: parseInt(e.target.value) } : null)}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

