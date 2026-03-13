'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, LogOut, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DashboardHeaderProps {
  userEmail?: string
  onLogout?: () => void
  onMenuClick?: () => void
}

export function DashboardHeader({ userEmail, onLogout, onMenuClick }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 dark:border-gray-700/30 bg-gradient-to-r from-background/95 via-background/90 to-background/85 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/85 backdrop-blur-md supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-background/60 supports-[backdrop-filter]:via-background/55 supports-[backdrop-filter]:to-background/50 shadow-sm dark:shadow-lg/20">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 h-[72px]">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-white/10 dark:hover:bg-gray-700/40 rounded-lg transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo - Center on mobile, Left on desktop */}
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg md:flex-1">
          <Image 
            src="/logo.png" 
            alt="RedFlag Logo" 
            width={32} 
            height={32}
            className="w-8 h-8"
          />
          <span className="hidden sm:inline bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-bold text-lg">
            RedFlag
          </span>
        </Link>

        {/* Right Section - Theme & User */}
        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-white/10 dark:hover:bg-gray-700/40 rounded-lg transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          )}

          {userEmail && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="gap-2 hover:bg-white/10 dark:hover:bg-gray-700/40 px-3 py-2 h-auto"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {userEmail.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 mt-2">
                <div className="px-3 py-3 text-sm text-muted-foreground border-b border-white/10 dark:border-gray-700/30 bg-gradient-to-b from-white/5 dark:from-gray-800/50 to-transparent">
                  <p className="font-semibold text-foreground mb-1">{userEmail.split('@')[0]}</p>
                  <p className="text-xs truncate text-muted-foreground">{userEmail}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onLogout} 
                  className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
