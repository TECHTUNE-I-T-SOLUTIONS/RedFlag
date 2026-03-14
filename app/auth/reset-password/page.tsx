'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AlertCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="w-full max-w-md backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image 
                src="/logo.png" 
                alt="RedFlag Logo" 
                width={48} 
                height={48}
                className="w-12 h-12"
              />
            </div>
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Password Reset</h1>
            <p className="text-muted-foreground mb-6">
              Password reset functionality is currently not available. 
              If you've forgotten your password, please contact our support team for assistance.
            </p>
            <div className="space-y-2">
              <Link href="/auth/login" className="block">
                <Button className="w-full">
                  Back to Login
                </Button>
              </Link>
              <Link href="/contact" className="block">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
