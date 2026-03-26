import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Group, IGroup } from '@/lib/models/Group'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  await connectDB()

  const groups = await Group.find({
    members: session.user.id,
  })
    .sort({ createdAt: -1 })
    .lean<IGroup[]>()

  const serializedGroups = groups.map((group) => ({
    id: group._id.toString(),
    name: group.name,
    description: group.description,
    inviteCode: group.inviteCode,
    status: group.status,
    memberCount: group.members.length,
    createdAt: group.createdAt.toISOString(),
    aiAnalysis: group.aiAnalysis || '',
  }))

  return <DashboardClient user={session.user} initialGroups={serializedGroups} />
}
