import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  FileText,
  MessageSquare,
  Users,
  Briefcase,
  Activity,
  Settings,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Blog', href: '/admin/blog', icon: FileText, requiredRole: 'editor' as const },
  { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare, requiredRole: 'editor' as const },
  { label: 'Team', href: '/admin/team', icon: Users, requiredRole: 'admin' as const },
  { label: 'Services', href: '/admin/services', icon: Briefcase, requiredRole: 'admin' as const },
  { label: 'Audit Logs', href: '/admin/audit', icon: Activity, requiredRole: 'admin' as const },
  { label: 'Users', href: '/admin/users', icon: Settings, requiredRole: 'super_admin' as const },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation()
  const { user, hasRole } = useAuth()

  if (!user) return null

  const visibleItems = NAV_ITEMS.filter(item => hasRole(item.requiredRole))

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 z-50 lg:z-0 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold">JSecurity</h1>
          <button onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4">
          <div className="text-xs text-slate-400 mb-3">
            <div>Logged in as:</div>
            <div className="font-semibold text-white capitalize">{user.role}</div>
          </div>
        </div>
      </aside>
    </>
  )
}

export function SidebarToggle() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
