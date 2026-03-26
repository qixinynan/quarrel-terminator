import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { v4 as uuidv4 } from 'uuid'
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
    const { name, description } = body

    if (!name || !description) {
      return NextResponse.json({ error: '请填写完整信息' }, { status: 400 })
    }

    await connectDB()

    const group = await Group.create({
      name,
      description,
      creatorId: session.user.id,
      members: [session.user.id],
      inviteCode: uuidv4().substring(0, 8).toUpperCase(),
    })

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
    console.error('Create group error:', error)
    return NextResponse.json({ error: '创建小组失败' }, { status: 500 })
  }
}
