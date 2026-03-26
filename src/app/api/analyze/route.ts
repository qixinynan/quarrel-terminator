import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Group } from '@/lib/models/Group'
import { Material } from '@/lib/models/Material'
import { analyzeDispute } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    const { groupId } = body

    if (!groupId) {
      return NextResponse.json({ error: '缺少小组ID' }, { status: 400 })
    }

    await connectDB()

    const group = await Group.findById(groupId)

    if (!group) {
      return NextResponse.json({ error: '小组不存在' }, { status: 404 })
    }

    if (group.creatorId.toString() !== session.user.id) {
      return NextResponse.json({ error: '只有创建者可以发起分析' }, { status: 403 })
    }

    if (group.status !== 'active') {
      return NextResponse.json({ error: '该小组当前状态不允许分析' }, { status: 400 })
    }

    group.status = 'analyzing'
    await group.save()

    const materials = await Material.find({ groupId })
      .populate('userId', 'name')
      .sort({ createdAt: 1 })
      .lean()

    if (materials.length < 2) {
      group.status = 'active'
      await group.save()
      return NextResponse.json({ error: '至少需要2份资料才能进行分析' }, { status: 400 })
    }

    const materialsData = materials.map((m) => ({
      userName: (m.userId as any).name,
      type: m.type,
      content: m.content,
      title: m.title || undefined,
    }))

    try {
      const analysis = await analyzeDispute(materialsData, group.description)

      group.aiAnalysis = analysis
      group.status = 'resolved'
      await group.save()

      return NextResponse.json({
        success: true,
        analysis,
      })
    } catch (aiError) {
      group.status = 'active'
      await group.save()
      throw aiError
    }
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '分析失败，请稍后重试' },
      { status: 500 }
    )
  }
}
