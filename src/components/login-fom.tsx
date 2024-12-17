// ----------------------------------------------------------
// File: component/login-form.tsx
// Author: Daniel Aquino Santiago
// Description: Component that displays the login form of the app
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

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const router = useRouter()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
  
    // Lógica de autenticación utilizando Axios
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/mytokenlogin/', {
        username,
        password,
      });
  
      console.log('Respuesta:', response.data);
  
      // Si la respuesta es exitosa (status 200)
      if (response.status === 200) {
        const { auth_token, user_id } = response.data;
        
        // Guardar el token y user_id en localStorage
        localStorage.setItem('token', auth_token);
        localStorage.setItem('user_id', user_id.toString());
        localStorage.setItem('username', username);
        
        console.log("Inicio de sesión exitoso, redirigiendo al dashboard.");
        
        // Redirigir al dashboard
        router.push('/auth/dashboard');
      } else {
        // Manejo de otros códigos de estado HTTP
        alert('Autenticación fallida. Verifica tus credenciales.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
  
    } finally {
      // Asegúrate de que el loading se apague, independientemente de si hubo éxito o error
      setIsLoading(false);
    }
  }
  

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
      </div>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username" className="text-zinc-400">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Enter your username"
              type="text"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading}
              className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-zinc-400">
                Password
              </Label>
            </div>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <div className="text-center text-sm text-zinc-400">
            Not a member?{' '}
            <Link href="/register" className="text-black hover:underline">
              Register Now
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
