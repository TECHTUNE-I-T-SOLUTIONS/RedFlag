'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface SidebarProps {
  items: NavItem[]
  collapsed?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onCollapsedChange?: (collapsed: boolean) => void
}

export function Sidebar({ items, collapsed = false, isOpen = true, onOpenChange, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(collapsed)

  const handleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    onCollapsedChange?.(newState)
  }

  const handleClose = () => {
    onOpenChange?.(false)
  }

  return (
    <>
      {/* Mobile overlay - only show when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={handleClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 flex flex-col border-r border-border/40 bg-card transition-all duration-300 z-40',
          // Mobile
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop/Tablet: always visible, no transform
          'md:translate-x-0',
          isCollapsed ? 'w-20' : 'w-60'
        )}
        style={{
          top: '72px', // Account for header height
        }}
      >
        {/* Mobile close button */}
        <button
          onClick={handleClose}
          className="md:hidden absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:py-6">
          <nav className="space-y-2">
            {items.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/dashboard')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 768) {
                      handleClose()
                    }
                  }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted',
                    isActive && 'bg-red-500/20 dark:bg-red-500/15 text-red-600 dark:text-red-400 font-medium border-l-2 border-red-500'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Collapse button - desktop only */}
        <div className="hidden md:block border-t border-border/40 p-4">
          <button
            onClick={handleCollapse}
            className="w-full flex items-center justify-center p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              className={cn(
                'w-5 h-5 transition-transform',
                isCollapsed && 'rotate-180'
              )}
            />
          </button>
        </div>
      </aside>
    </>
  )
}
