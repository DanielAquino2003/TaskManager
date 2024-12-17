// ----------------------------------------------------------
// File: register/page.tsx
// Author: Daniel Aquino Santiago
// Description: This file stablish the interface and way of getting tasks and tasks families
// ----------------------------------------------------------

import { RegisterForm } from '@/components/register-form'
import { CheckSquare } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center">
      {/* Header */}
      <header className="p-6 w-full">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <CheckSquare className="h-10 w-10" />
            <span className="text-3xl font-bold">TaskLY</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              href="/register" 
              className="text-lg text-zinc-600 hover:text-zinc-900"
            >
              Register
            </Link>
            <Link 
              href="/login"
              className="text-lg font-medium text-zinc-900"
            >
              Log In
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center w-full">
        <div className="flex flex-col justify-center space-y-8 sm:w-[400px] text-center">
          <RegisterForm />
        </div>
      </main>
    </div>
  )
}
