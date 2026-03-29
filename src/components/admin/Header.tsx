import { useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, Menu, Settings, User } from 'lucide-react'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()
  const { user, logout } = useAuth()

  // Get page title from route
  const getPageTitle = () => {
    const path = location.pathname
    if (path.includes('/blog')) return 'Blog Management'
    if (path.includes('/reviews')) return 'Reviews Management'
    if (path.includes('/team')) return 'Team Management'
    if (path.includes('/services')) return 'Services Management'
    if (path.includes('/audit')) return 'Audit Logs'
    if (path.includes('/users')) return 'User Management'
    return 'Admin Dashboard'
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  if (!user) return null

  const userInitials = user.username
    ? user.username.substring(0, 2).toUpperCase()
    : 'U'

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left - Hamburger + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">{getPageTitle()}</h1>
        </div>

        {/* Right - User Menu */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-slate-900">
                    {user.username || 'User'}
                  </div>
                  <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <div className="text-sm font-semibold text-slate-900">
                  {user.username || 'User'}
                </div>
                <div className="text-xs text-slate-500">{user.email}</div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem disabled>
                <User className="mr-2 h-4 w-4" />
                <span>Profile (Coming Soon)</span>
              </DropdownMenuItem>

              <DropdownMenuItem disabled>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings (Coming Soon)</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
