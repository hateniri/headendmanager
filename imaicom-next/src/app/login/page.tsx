'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Lock, Mail, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'ログインに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">IMAICOM-X</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">ヘッドエンド管理システム</p>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
          ログイン
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-500" />
                  <div className="ml-3">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                メールアドレス
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="user@headend.jp"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                パスワード
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">テストアカウント</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">管理者</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">admin@headend.jp / admin123</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">地域管理者</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">kanto@headend.jp / kanto123</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">エンジニア</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">engineer@headend.jp / engineer123</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">閲覧者</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">viewer@headend.jp / viewer123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}