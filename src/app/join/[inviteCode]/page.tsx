import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Group } from '@/lib/models/Group'

interface Props {
  params: { inviteCode: string }
}

export default async function JoinPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/auth/login?redirect=/join/${params.inviteCode}`)
  }

  await connectDB()

  const group = await Group.findOne({ inviteCode: params.inviteCode.toUpperCase() })

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">邀请链接无效</h1>
          <p className="text-gray-600 dark:text-gray-400">该邀请链接不存在或已过期</p>
        </div>
      </div>
    )
  }

  if (!group.members.includes(session.user.id as any)) {
    group.members.push(session.user.id as any)
    await group.save()
  }

  redirect(`/group/${group._id}`)
}
