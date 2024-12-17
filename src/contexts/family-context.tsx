// ----------------------------------------------------------
// File: contexts/family-dialog.tsx
// Author: Daniel Aquino Santiago
// Description: This file defines the FamilyDialog context component, which provides a list of families to the app.
// ----------------------------------------------------------


'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface Family {
  id: number
  title: string
  color?: string
}

interface FamilyContextType {
  families: Family[]
  fetchFamilies: () => Promise<void>
  isLoading: boolean
  error: string | null
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined)

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [families, setFamilies] = useState<Family[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchFamilies = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("No token found. Please log in.")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.get("http://127.0.0.1:8000/api/family/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      setFamilies(response.data)
      localStorage.setItem("families", JSON.stringify(response.data))
    } catch (error) {
      console.error("Error fetching families:", error)
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setError("Unauthorized. Please log in again.")
        router.push('/login')
      } else {
        setError("An error occurred while fetching families.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchFamilies()
    }
  }, [])

  return (
    <FamilyContext.Provider value={{ families, fetchFamilies, isLoading, error }}>
      {children}
    </FamilyContext.Provider>
  )
}

export const useFamilies = () => {
  const context = useContext(FamilyContext)
  if (context === undefined) {
    throw new Error('useFamilies must be used within a FamilyProvider')
  }
  return context
}

