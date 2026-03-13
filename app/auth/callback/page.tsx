'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from URL params (Supabase sends this in email links)
        const code = searchParams.get('code')
        const redirectTo = searchParams.get('next') || '/dashboard'

        if (code) {
          // Exchange the code for a session
          const { error } = await supabase.auth.exchangeCodeForSession(code)

          if (error) {
            console.error('Auth callback error:', error)
            toast.error('Failed to confirm email. Please try again.')
            router.push('/auth/login')
            return
          }

          toast.success('Email confirmed! You are now logged in.')
          router.push(redirectTo)
        } else {
          // No code in URL, just redirect to login
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Callback error:', error)
        toast.error('An error occurred. Please try again.')
        router.push('/auth/login')
      } finally {
        setIsProcessing(false)
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">
          {isProcessing ? 'Confirming your email...' : 'Redirecting...'}
        </p>
      </div>
    </div>
  )
}

function AuthCallbackLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackLoader />}>
      <AuthCallbackContent />
    </Suspense>
  )
}
