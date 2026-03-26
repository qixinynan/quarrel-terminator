import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Group } from '@/lib/models/Group'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    const { inviteCode } = body

    if (!inviteCode) {
      return NextResponse.json({ error: '请输入邀请码' }, { status: 400 })
    }

    await connectDB()

    const group = await Group.findOne({ inviteCode: inviteCode.toUpperCase() })

    if (!group) {
      return NextResponse.json({ error: '邀请码无效' }, { status: 404 })
    }

    if (group.members.includes(session.user.id as any)) {
      return NextResponse.json({ error: '您已经是小组成员' }, { status: 400 })
    }

    group.members.push(session.user.id as any)
    await group.save()

    return NextResponse.json({
      id: group._id.toString(),
      name: group.name,
      description: group.description,
      inviteCode: group.inviteCode,
      status: group.status,
      memberCount: group.members.length,
      createdAt: group.createdAt.toISOString(),
    })
  } catch (error) {
    console.error('Join group error:', error)
    return NextResponse.json({ error: '加入小组失败' }, { status: 500 })
  }
}
