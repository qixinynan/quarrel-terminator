'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface User {
  id: string
  email: string
  name: string
}

interface Group {
  id: string
  name: string
  description: string
  inviteCode: string
  status: string
  memberCount: number
  createdAt: string
  aiAnalysis: string
}

interface DashboardClientProps {
  user: User
  initialGroups: Group[]
}

export default function DashboardClient({ user, initialGroups }: DashboardClientProps) {
  const router = useRouter()
  const [groups, setGroups] = useState(initialGroups)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })

      if (response.ok) {
        const newGroup = await response.json()
        setGroups([newGroup, ...groups])
        setShowCreateModal(false)
        router.refresh()
      }
    } catch (error) {
      console.error('Create group error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const inviteCode = formData.get('inviteCode') as string

    try {
      const response = await fetch('/api/groups/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode }),
      })

      if (response.ok) {
        const joinedGroup = await response.json()
        setGroups([joinedGroup, ...groups])
        setShowJoinModal(false)
        router.refresh()
      }
    } catch (error) {
      console.error('Join group error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyInviteLink = (inviteCode: string) => {
    const link = `${window.location.origin}/join/${inviteCode}`
    navigator.clipboard.writeText(link)
    alert('邀请链接已复制到剪贴板')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">QuarrelTerminator</span>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300">欢迎，{user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">我的争端小组</h1>
          <div className="flex space-x-3">
            <button onClick={() => setShowJoinModal(true)} className="btn-secondary">
              加入小组
            </button>
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              创建小组
            </button>
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">暂无争端小组</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">创建一个新小组开始解决争端，或加入已有小组</p>
            <div className="flex justify-center space-x-3">
              <button onClick={() => setShowJoinModal(true)} className="btn-secondary">
                加入小组
              </button>
              <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                创建小组
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div key={group.id} className="card hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      group.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : group.status === 'analyzing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {group.status === 'active' ? '进行中' : group.status === 'analyzing' ? '分析中' : '已解决'}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{group.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{group.memberCount} 位成员</span>
                  <span>{new Date(group.createdAt).toLocaleDateString('zh-CN')}</span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Link href={`/group/${group.id}`} className="btn-primary flex-1 text-center text-sm py-2">
                    进入小组
                  </Link>
                  <button
                    onClick={() => copyInviteLink(group.inviteCode)}
                    className="btn-secondary text-sm py-2 px-3"
                    title="复制邀请链接"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">创建争端小组</h2>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">小组名称</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="例如：房屋租赁纠纷"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">争端描述</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  className="input-field"
                  placeholder="请简要描述争端的情况..."
                />
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">
                  取消
                </button>
                <button type="submit" disabled={isLoading} className="btn-primary flex-1">
                  {isLoading ? '创建中...' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">加入小组</h2>
            <form onSubmit={handleJoinGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邀请码</label>
                <input
                  name="inviteCode"
                  type="text"
                  required
                  className="input-field"
                  placeholder="请输入邀请码"
                />
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowJoinModal(false)} className="btn-secondary flex-1">
                  取消
                </button>
                <button type="submit" disabled={isLoading} className="btn-primary flex-1">
                  {isLoading ? '加入中...' : '加入'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
