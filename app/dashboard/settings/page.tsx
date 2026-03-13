'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Sun, Moon, Bell, LogOut, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { LogoutConfirmModal } from '@/components/LogoutConfirmModal'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [joinedDate, setJoinedDate] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !mounted) {
      setMounted(true)
      fetchUserData()
    }
  }, [mounted])

  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        console.error('Auth error:', error)
        toast.error('Failed to load user data')
        return
      }

      if (user) {
        setUserEmail(user.email || 'Not available')
        setJoinedDate(
          new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        )
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast.error('Failed to load user information')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      setLogoutModalOpen(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="space-y-6 w-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Theme Settings */}
      <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-6">Appearance</h2>

        <div className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-4 block">Theme</Label>
            <div className="flex gap-4">
              {mounted && (
                <>
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-colors ${
                      theme === 'light'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Sun className="w-5 h-5" />
                    <span className="font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-colors ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Moon className="w-5 h-5" />
                    <span className="font-medium">Dark</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-6">Notifications</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-base font-semibold">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates and alerts</p>
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </div>
      </Card>

      {/* Account Settings */}
      <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-6">Account</h2>

        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">Email Address</Label>
            {isLoading ? (
              <div className="flex items-center gap-2 mt-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <p className="font-medium">{userEmail}</p>
            )}
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Member Since</Label>
            {isLoading ? (
              <div className="flex items-center gap-2 mt-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <p className="font-medium">{joinedDate || 'Not available'}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Logout */}
      <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg border-red-500/20">
        <h2 className="text-xl font-bold mb-6">Session</h2>

        <Button
          variant="destructive"
          onClick={() => setLogoutModalOpen(true)}
          disabled={isLoggingOut}
          className="w-full sm:w-auto"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </>
          )}
        </Button>
      </Card>

      <LogoutConfirmModal
        open={logoutModalOpen}
        onOpenChange={setLogoutModalOpen}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </div>
  )
}
