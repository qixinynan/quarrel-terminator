import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              QuarrelTerminator
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/dashboard" className="btn-primary">
                  进入控制台
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                  登录
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  免费注册
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 text-balance">
            AI驱动的<span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">争端终结者</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-balance">
            公正、高效、智能的争端解决平台。让AI成为您的公正裁判，帮助各方达成共识。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
              立即开始
            </Link>
            <Link href="#features" className="btn-secondary text-lg px-8 py-3">
              了解更多
            </Link>
          </div>
        </div>

        <div id="features" className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="card">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">小组协作</h3>
            <p className="text-gray-600 dark:text-gray-300">
              创建争端解决小组，邀请相关方加入，共同提交证据和立场陈述。
            </p>
          </div>

          <div className="card">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI智能分析</h3>
            <p className="text-gray-600 dark:text-gray-300">
              先进的AI算法客观分析各方论点，提供公正的评判和解决方案。
            </p>
          </div>

          <div className="card">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">安全可靠</h3>
            <p className="text-gray-600 dark:text-gray-300">
              端到端加密保护您的数据，确保争端内容的隐私和安全。
            </p>
          </div>
        </div>

        <div className="mt-32 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">工作流程</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">创建小组</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">发起争端并创建解决小组</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">邀请成员</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">分享链接邀请相关方加入</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">提交证据</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">各方上传文字和图片资料</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                4
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI裁决</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">获取公正的解决方案</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="container mx-auto px-6 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 QuarrelTerminator. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
