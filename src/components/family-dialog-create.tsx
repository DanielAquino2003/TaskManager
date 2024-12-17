// ----------------------------------------------------------
// File: component/family-dialog-create.tsx
// Author: Daniel Aquino Santiago
// Description: This file defines the CreateFamilyDialog component, which allows users to create a new family.
// ----------------------------------------------------------


"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import axios from "axios"

interface CreateFamilyDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onFamilyCreated: (family: { id: number, title: string, color: string }) => void
    setAuthError: (error: string) => void
}

const colorOptions = [
    { value: "bg-red-500", label: "Red" },
    { value: "bg-blue-500", label: "Blue" },
    { value: "bg-green-500", label: "Green" },
    { value: "bg-yellow-500", label: "Yellow" },
    { value: "bg-purple-500", label: "Purple" },
    { value: "bg-pink-500", label: "Pink" },
    { value: "bg-indigo-500", label: "Indigo" },
    { value: "bg-teal-500", label: "Teal" },
]

export function CreateFamilyDialog({ open, onOpenChange, onFamilyCreated, setAuthError }: CreateFamilyDialogProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [color, setColor] = useState(colorOptions[0].value)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const token = localStorage.getItem("token")
            
            const response = await axios.post("http://127.0.0.1:8000/api/family/", 
                {
                    title,
                    description,
                    color,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            )

            onFamilyCreated({
                id: response.data.id,
                title: response.data.title,
                color: response.data.color
            })
            onOpenChange(false)
            setTitle("")
            setDescription("")
            setColor(colorOptions[0].value)
        } catch (error) {
            console.error("Error creating family:", error)
            setAuthError('Error creating family. Please try again.')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-900 text-white max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Create New Family
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white"
                          required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Color</Label>
                        <RadioGroup value={color} onValueChange={setColor} className="flex flex-wrap gap-2">
                            {colorOptions.map((option) => (
                                <div key={option.value} className="flex items-center">
                                    <RadioGroupItem
                                        value={option.value}
                                        id={option.value}
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor={option.value}
                                        className={`w-8 h-8 rounded-full cursor-pointer ring-2 ring-transparent peer-focus:ring-white ${option.value}`}
                                    />
                                </div>
                            ))}
                        </RadioGroup>
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
                        Create Family
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

