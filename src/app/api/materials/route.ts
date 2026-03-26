import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Material } from '@/lib/models/Material'
import { Group } from '@/lib/models/Group'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    const { groupId, type, title, content } = body

    if (!groupId || !type || !content) {
      return NextResponse.json({ error: '请填写完整信息' }, { status: 400 })
    }

    await connectDB()

    const group = await Group.findById(groupId)

    if (!group || !group.members.includes(session.user.id as any)) {
      return NextResponse.json({ error: '无权访问该小组' }, { status: 403 })
    }

    const material = await Material.create({
      groupId,
      userId: session.user.id,
      type,
      title: title || '',
      content,
    })

    await material.populate('userId', 'name avatar')

    return NextResponse.json({
      id: material._id.toString(),
      type: material.type,
      content: material.content,
      title: material.title,
      user: {
        id: (material.userId as any)._id.toString(),
        name: (material.userId as any).name,
        avatar: (material.userId as any).avatar || '',
      },
      createdAt: material.createdAt.toISOString(),
    })
  } catch (error) {
    console.error('Create material error:', error)
    return NextResponse.json({ error: '创建资料失败' }, { status: 500 })
  }
}
