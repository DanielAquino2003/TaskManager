// ----------------------------------------------------------
// File: page.tsx
// Author: Daniel Aquino Santiago
// Description: Home page of the application, where the user can register or log in
// ----------------------------------------------------------

import Link from 'next/link'
import { CheckSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import Illustration from '../../public/rb_2148832142.png';


export default function MainPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-100">
      {/* Header */}
      <header className="p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-8 w-8" />
            <span className="text-2xl font-bold">TaskLY</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/register" 
              className="text-zinc-600 hover:text-zinc-900"
            >
              Register
            </Link>
            <Link 
              href="/login"
              className="font-medium text-zinc-900"
            >
              Log In
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold text-zinc-600 mb-4">
                We present
              </h1>
              <h2 className="text-5xl font-bold text-zinc-900 mb-6">
                Our ideal task manager application, hope you find it useful
              </h2>
              <p className="text-zinc-600 mb-8">
                Daniel Aquino & Máximo Martin
              </p>
              <Button asChild size="lg">
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
            <div className="lg:w-1/2">
            <Image 
              src={Illustration} 
              alt="Task Management Illustration" 
              width={500} 
              height={500} 
              className="rounded-lg"
              priority // Load the image before the page is rendered
            />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-zinc-600 text-center">© 2024 TaskLY. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

