'use client'

import { useAuth, PermissionType } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Lock } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: PermissionType
  requiredRole?: 'admin' | 'regional_mgr' | 'engineer' | 'viewer'
  facilityId?: string
}

export default function ProtectedRoute({ 
  children, 
  requiredPermission,
  requiredRole,
  facilityId 
}: ProtectedRouteProps) {
  const { user, loading, hasPermission, canAccessFacility } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // ロールチェック
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <Lock className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
            アクセス権限がありません
          </h3>
          <p className="mt-2 text-sm text-gray-600 text-center">
            このページを表示するには{requiredRole === 'admin' ? '管理者' : 
            requiredRole === 'regional_mgr' ? '地域管理者' : 
            requiredRole === 'engineer' ? 'エンジニア' : '閲覧者'}権限が必要です。
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 権限チェック
  if (requiredPermission && !hasPermission(requiredPermission, facilityId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <Lock className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
            権限が不足しています
          </h3>
          <p className="mt-2 text-sm text-gray-600 text-center">
            この操作を実行する権限がありません。
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 施設アクセスチェック
  if (facilityId && !canAccessFacility(facilityId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <Lock className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
            この施設へのアクセス権限がありません
          </h3>
          <p className="mt-2 text-sm text-gray-600 text-center">
            担当施設のみアクセス可能です。
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}