'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { User, LogOut, Shield } from 'lucide-react'

export default function AuthHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const roleLabels = {
    admin: '管理者',
    regional_mgr: '地域管理者',
    engineer: 'エンジニア',
    viewer: '閲覧者'
  }

  const roleColors = {
    admin: 'bg-purple-100 text-purple-700',
    regional_mgr: 'bg-blue-100 text-blue-700',
    engineer: 'bg-green-100 text-green-700',
    viewer: 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-900">{user.name}</span>
            </div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                <Shield className="h-3 w-3 mr-1" />
                {roleLabels[user.role]}
              </span>
            </div>
            {user.department && (
              <span className="text-sm text-gray-500">{user.department}</span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <LogOut className="h-3 w-3 mr-1" />
            ログアウト
          </button>
        </div>
      </div>
    </div>
  )
}