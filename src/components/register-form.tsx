// ----------------------------------------------------------
// File: component/register-form.tsx
// Author: Daniel Aquino Santiago
// Description: Component that displays the register form of the app
// ----------------------------------------------------------


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import axios from 'axios'

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const router = useRouter()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    console.log('Email:', email);
    console.log('Username:', username);
    console.log('Password:',)
  
    // Lógica de autenticación utilizando Axios
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/", {
        username,
        email,
        password
      });
  
      console.log('Respuesta:', response.data);
  
      // Si la respuesta es exitosa (status 200)
      if (response.status === 201) {
        console.log("Registro exitoso, redirigiendo al login.");
        router.push('/login');
      } else {
        // Manejo de otros códigos de estado HTTP
        alert('Registro fallido.');
      }
    } catch (error) {
      console.error('Error al registrarse:', error);
  
    } finally {
      // Asegúrate de que el loading se apague, independientemente de si hubo éxito o error
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
      </div>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className='text-zinc-400'>Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-400"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username" className='text-zinc-400'>Username</Label>
            <Input
              id="username"
              placeholder="Choose a username"
              type="text"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading}
              className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-400"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className='text-zinc-400'>Password</Label>
            <Input
              id="password"
              placeholder="Create a password"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading}
              className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-400"
              value={password}
              onChange={(event) => setPassword(event.target.value)}

            />
          </div>
          <Button disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
          <div className="text-center text-sm text-zinc-600">
            Already have an account?{" "}
            <Link href="/login" className="text-zinc-900 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

