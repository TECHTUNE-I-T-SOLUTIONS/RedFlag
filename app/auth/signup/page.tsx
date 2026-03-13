'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (!agreed) {
      toast.error('Please accept the terms and conditions')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message || 'Failed to create account')
        setIsLoading(false)
        return
      }

      toast.success('Account created! Check your email to confirm.')
      router.push('/auth/login')
      
      // Keep isLoading true to prevent resubmission during redirect
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const passwordStrength = password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak'

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="w-full max-w-md backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image 
                src="/logo.png" 
                alt="RedFlag Logo" 
                width={48} 
                height={48}
                className="w-12 h-12"
              />
            </div>
            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground">Start protecting yourself from scams today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex gap-1 mt-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full ${
                      passwordStrength === 'strong'
                        ? 'bg-green-500'
                        : passwordStrength === 'medium'
                        ? i < 2
                          ? 'bg-yellow-500'
                          : 'bg-muted'
                        : i === 0
                        ? 'bg-red-500'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                disabled={isLoading}
              />
              <label htmlFor="agree" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
