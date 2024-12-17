// ----------------------------------------------------------
// File: component/day-dialog.tsx
// Author: Daniel Aquino Santiago
// Description: Component that shows the tasks of a day in a dialog box
// ----------------------------------------------------------

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Task, Family } from '@/app/auth/lib/api'

interface DayDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  day: Date
  tasks: Task[]
  families: Family[]
}

export function DayDialog({ open, onOpenChange, day, tasks, families }: DayDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {day.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {tasks.length === 0 ? (
            <p className="text-zinc-400">No tasks for this day.</p>
          ) : (
            tasks.map((task) => {
              const family = families.find(f => f.id === Number(task.family))
              return (
                <div key={task.id} className="bg-zinc-800 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{task.title}</h3>
                    <div 
                      className={cn(
                        "w-3 h-3 rounded-full",
                        family ? family.color : 'bg-gray-500'
                      )}
                    />
                  </div>
                  <p className="text-sm text-zinc-400 mb-1">{task.description}</p>
                  <div className="text-xs text-zinc-500">
                    <span>{task.hora}</span>
                    {task.location && <span> • {task.location}</span>}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

