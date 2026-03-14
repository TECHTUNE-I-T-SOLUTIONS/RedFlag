'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
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
  const { data: session, status } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard')
    }
  }, [status, router])

  useEffect(() => {
    // Fetch unread notifications count
    const fetchUnreadCount = async () => {
      try {
        if (status !== 'authenticated' || !session?.user?.id) {
          return
        }

        const response = await fetch('/api/notifications/count', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const { unreadCount } = await response.json()
          setUnreadNotifications(unreadCount || 0)
        }
      } catch (error) {
        console.error('Error fetching notification count:', error)
      }
    }

    fetchUnreadCount()

    // Poll for notifications every 10 seconds
    const interval = setInterval(fetchUnreadCount, 10000)

    return () => clearInterval(interval)
  }, [status, session])

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
      await signOut({ redirect: true, callbackUrl: '/' })
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to logout')
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <DashboardHeader
        userEmail={session?.user?.email || ''}
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
