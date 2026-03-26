'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Member {
  id: string
  name: string
  email: string
  avatar: string
}

interface Material {
  id: string
  type: 'text' | 'image'
  content: string
  title: string
  imageUrl: string
  user: {
    id: string
    name: string
    avatar: string
  }
  createdAt: string
}

interface Group {
  id: string
  name: string
  description: string
  inviteCode: string
  status: string
  aiAnalysis: string
  members: Member[]
  creator: {
    id: string
    name: string
  }
  createdAt: string
}

interface GroupClientProps {
  group: Group
  materials: Material[]
  currentUserId: string
}

export default function GroupClient({ group, materials: initialMaterials, currentUserId }: GroupClientProps) {
  const router = useRouter()
  const [materials, setMaterials] = useState(initialMaterials)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadType, setUploadType] = useState<'text' | 'image'>('text')
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleUploadText = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const content = formData.get('content') as string

    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: group.id,
          type: 'text',
          title,
          content,
        }),
      })

      if (response.ok) {
        const newMaterial = await response.json()
        setMaterials([newMaterial, ...materials])
        setShowUploadModal(false)
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const file = formData.get('image') as File
    const content = formData.get('content') as string

    if (!file) {
      setIsLoading(false)
      return
    }

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('groupId', group.id)
      uploadFormData.append('content', content)

      const response = await fetch('/api/materials/image', {
        method: 'POST',
        body: uploadFormData,
      })

      if (response.ok) {
        const newMaterial = await response.json()
        setMaterials([newMaterial, ...materials])
        setShowUploadModal(false)
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId: group.id }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyInviteLink = () => {
    const link = `${window.location.origin}/join/${group.inviteCode}`
    navigator.clipboard.writeText(link)
    alert('邀请链接已复制到剪贴板')
  }

  const isCreator = group.creator.id === currentUserId

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">QuarrelTerminator</span>
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 dark:text-gray-300">
              返回控制台
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{group.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">{group.description}</p>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">成员 ({group.members.length})</h3>
                <div className="space-y-2">
                  {group.members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">{member.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{member.name}</span>
                      {member.id === group.creator.id && (
                        <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">创建者</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={copyInviteLink} className="btn-secondary w-full text-sm">
                复制邀请链接
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {group.status === 'resolved' && group.aiAnalysis && (
              <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI分析结果
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{group.aiAnalysis}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">提交的证据与立场</h2>
              <div className="flex space-x-3">
                {isCreator && group.status === 'active' && materials.length >= 2 && (
                  <button onClick={handleAnalyze} disabled={isAnalyzing} className="btn-primary">
                    {isAnalyzing ? '分析中...' : '开始AI分析'}
                  </button>
                )}
                <button onClick={() => setShowUploadModal(true)} className="btn-secondary">
                  上传资料
                </button>
              </div>
            </div>

            {materials.length === 0 ? (
              <div className="card text-center py-12">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">暂无资料</h3>
                <p className="text-gray-600 dark:text-gray-400">点击上方按钮上传您的证据和立场陈述</p>
              </div>
            ) : (
              <div className="space-y-4">
                {materials.map((material) => (
                  <div key={material.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">{material.user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{material.user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(material.createdAt).toLocaleString('zh-CN')}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          material.type === 'text' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {material.type === 'text' ? '文字' : '图片'}
                      </span>
                    </div>
                    {material.title && <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{material.title}</h3>}
                    {material.type === 'image' && material.imageUrl && (
                      <img src={material.imageUrl} alt={material.title} className="w-full max-w-md rounded-lg mb-3" />
                    )}
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{material.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">上传资料</h2>

            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setUploadType('text')}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  uploadType === 'text'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                文字资料
              </button>
              <button
                onClick={() => setUploadType('image')}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  uploadType === 'image'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                图片资料
              </button>
            </div>

            {uploadType === 'text' ? (
              <form onSubmit={handleUploadText} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">标题（可选）</label>
                  <input name="title" type="text" className="input-field" placeholder="简要概括您的立场" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">内容</label>
                  <textarea
                    name="content"
                    required
                    rows={6}
                    className="input-field"
                    placeholder="详细描述您的立场、观点和证据..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button type="button" onClick={() => setShowUploadModal(false)} className="btn-secondary flex-1">
                    取消
                  </button>
                  <button type="submit" disabled={isLoading} className="btn-primary flex-1">
                    {isLoading ? '上传中...' : '提交'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleUploadImage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">图片</label>
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">说明</label>
                  <textarea
                    name="content"
                    required
                    rows={4}
                    className="input-field"
                    placeholder="描述图片内容及其作为证据的意义..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button type="button" onClick={() => setShowUploadModal(false)} className="btn-secondary flex-1">
                    取消
                  </button>
                  <button type="submit" disabled={isLoading} className="btn-primary flex-1">
                    {isLoading ? '上传中...' : '提交'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
