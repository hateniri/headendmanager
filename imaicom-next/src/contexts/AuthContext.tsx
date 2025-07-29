'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'admin' | 'regional_mgr' | 'engineer' | 'viewer'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department?: string
  // 地域管理者の場合、管理する地域
  regions?: string[]
  // エンジニアの場合、担当施設
  facilities?: string[]
  // 表示用の役職名
  jobTitle?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: PermissionType, targetId?: string) => boolean
  canAccessFacility: (facilityId: string) => boolean
  canEditFacility: (facilityId: string) => boolean
}

// 権限タイプの定義
export type PermissionType = 
  | 'view_all_facilities'
  | 'edit_facility'
  | 'create_inspection'
  | 'edit_inspection'
  | 'create_repair'
  | 'edit_repair'
  | 'manage_assets'
  | 'export_data'
  | 'view_audit_logs'
  | 'manage_users'

// ロール別権限マトリクス
const rolePermissions: Record<UserRole, PermissionType[]> = {
  admin: [
    'view_all_facilities',
    'edit_facility',
    'create_inspection',
    'edit_inspection',
    'create_repair',
    'edit_repair',
    'manage_assets',
    'export_data',
    'view_audit_logs',
    'manage_users'
  ],
  regional_mgr: [
    'view_all_facilities',
    'edit_facility',
    'create_inspection',
    'edit_inspection',
    'create_repair',
    'edit_repair',
    'manage_assets',
    'export_data',
    'view_audit_logs'
  ],
  engineer: [
    'view_all_facilities',
    'create_inspection',
    'edit_inspection',
    'create_repair',
    'edit_repair'
  ],
  viewer: [
    'view_all_facilities'
  ]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ダミーユーザーデータ
const dummyUsers: Record<string, User & { password: string }> = {
  'admin@headend.jp': {
    id: 'USR001',
    email: 'admin@headend.jp',
    password: 'admin123',
    name: '管理者 太郎',
    role: 'admin',
    department: 'ICT推進部',
    jobTitle: 'システム管理者'
  },
  'kanto@headend.jp': {
    id: 'USR002',
    email: 'kanto@headend.jp',
    password: 'kanto123',
    name: '関東 花子',
    role: 'regional_mgr',
    department: '関東ブロック',
    regions: ['関東'],
    jobTitle: '地域統括責任者'
  },
  'engineer@headend.jp': {
    id: 'USR003',
    email: 'engineer@headend.jp',
    password: 'engineer123',
    name: '技術 次郎',
    role: 'engineer',
    department: '保守技術部',
    facilities: ['HE_001', 'HE_002', 'HE_003', 'HE_004', 'HE_005'],
    jobTitle: '保守エンジニア'
  },
  'viewer@headend.jp': {
    id: 'USR004',
    email: 'viewer@headend.jp',
    password: 'viewer123',
    name: '閲覧 美咲',
    role: 'viewer',
    department: '経営企画部',
    jobTitle: '企画担当'
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ローカルストレージから認証情報を復元
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // ダミー認証処理
    const foundUser = dummyUsers[email]
    if (foundUser && foundUser.password === password) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
    } else {
      throw new Error('メールアドレスまたはパスワードが正しくありません')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const hasPermission = (permission: PermissionType, targetId?: string): boolean => {
    if (!user) return false
    
    const userPermissions = rolePermissions[user.role]
    if (!userPermissions.includes(permission)) return false
    
    // 地域制限のチェック（regional_mgr）
    if (user.role === 'regional_mgr' && targetId) {
      // targetIdが施設IDの場合、その施設の地域をチェック
      // ここでは簡単のため、施設IDから地域を推定
      // 実際の実装では施設データから地域を取得する
      return true // 仮実装
    }
    
    // 施設制限のチェック（engineer）
    if (user.role === 'engineer' && targetId && user.facilities) {
      return user.facilities.includes(targetId)
    }
    
    return true
  }

  const canAccessFacility = (facilityId: string): boolean => {
    if (!user) return false
    
    switch (user.role) {
      case 'admin':
      case 'viewer':
        return true
      case 'regional_mgr':
        // 地域に基づくチェック（実装簡略化）
        return true
      case 'engineer':
        return user.facilities?.includes(facilityId) || false
      default:
        return false
    }
  }

  const canEditFacility = (facilityId: string): boolean => {
    if (!user) return false
    
    switch (user.role) {
      case 'admin':
        return true
      case 'regional_mgr':
        // 地域に基づくチェック（実装簡略化）
        return true
      case 'engineer':
      case 'viewer':
        return false
      default:
        return false
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout, 
        hasPermission,
        canAccessFacility,
        canEditFacility
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}