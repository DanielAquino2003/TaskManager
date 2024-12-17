// ----------------------------------------------------------
// File: lib/api.tsx
// Author: Daniel Aquino Santiago
// Description: This file stablish the interface and way of getting tasks and tasks families
// The component fetches tasks and family data from an API.
// ----------------------------------------------------------


import axios from 'axios';

export interface Family {
  id: number;
  color: string; // Ahora esto será una clase de Tailwind, por ejemplo "bg-indigo-500"
}

export interface Task {
  id: number;
  title: string;
  fecha: string;
  hora: string;
  location: string;
  description: string;
  family: string | null;
  status: 'TODO' | 'DOING' | 'DONE' | 'PAUSED';
  puntosDeExperiencia: number;
}



export async function getTasks(): Promise<Task[]> {
  const token = localStorage.getItem("token");
  const response = await axios.get('http://127.0.0.1:8000/api/tasks/', {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return response.data;
}

export async function getFamilies(): Promise<Family[]> {
  const token = localStorage.getItem("token");
  const response = await axios.get('http://127.0.0.1:8000/api/family/', {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return response.data;
}

