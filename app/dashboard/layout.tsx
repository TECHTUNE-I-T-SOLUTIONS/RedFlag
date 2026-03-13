'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getSessionFromStorage, clearSession } from '@/lib/session-storage'
import { DashboardHeader } from '@/components/DashboardHeader'
import { Sidebar } from '@/components/Sidebar'
import { LogoutConfirmModal } from '@/components/LogoutConfirmModal'
import { toast } from 'sonner'
import {
  BarChart3,
  Shield,
  History,
  Settings,
  Bell,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string>('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    // Get user email - check Supabase first, then localStorage
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.email) {
        setUserEmail(user.email)
        return
      }
      
      // Fallback to localStorage if Supabase user not found
      const session = getSessionFromStorage()
      if (session?.user?.email) {
        setUserEmail(session.user.email)
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    // Fetch unread notifications count
    const fetchUnreadCount = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false)

        if (!error) {
          setUnreadNotifications(count || 0)
        }
      } catch (error) {
        console.error('Error fetching notification count:', error)
      }
    }

    fetchUnreadCount()

    // Subscribe to notifications in real-time
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
      }, () => {
        fetchUnreadCount()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    // Close sidebar when resizing to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Analyze', href: '/dashboard/analyze', icon: <Shield className="w-5 h-5" /> },
    { label: 'History', href: '/dashboard/history', icon: <History className="w-5 h-5" /> },
    { 
      label: 'Notifications', 
      href: '/dashboard/notifications', 
      icon: (
        <div className="relative">
          <Bell className="w-5 h-5" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs font-bold">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
        </div>
      ),
    },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
  ]

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await supabase.auth.signOut()
      clearSession() // Clear localStorage session
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Failed to logout')
    } finally {
      setIsLoggingOut(false)
      setLogoutModalOpen(false)
    }
  }

  return (
    <>
      <DashboardHeader
        userEmail={userEmail}
        onLogout={() => setLogoutModalOpen(true)}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="flex h-[calc(100vh-72px)]">
        <Sidebar 
          items={navItems}
          isOpen={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          onCollapsedChange={setIsSidebarCollapsed}
        />

        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-60'}`}>
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>

      <LogoutConfirmModal
        open={logoutModalOpen}
        onOpenChange={setLogoutModalOpen}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </>
  )
}
