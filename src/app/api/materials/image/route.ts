import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Material } from '@/lib/models/Material'
import { Group } from '@/lib/models/Group'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const groupId = formData.get('groupId') as string
    const content = formData.get('content') as string

    if (!file || !groupId || !content) {
      return NextResponse.json({ error: '请填写完整信息' }, { status: 400 })
    }

    await connectDB()

    const group = await Group.findById(groupId)

    if (!group || !group.members.includes(session.user.id as any)) {
      return NextResponse.json({ error: '无权访问该小组' }, { status: 403 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'quarrel-terminator',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        .end(buffer)
    })

    const uploadResult = uploadResponse as any

    const material = await Material.create({
      groupId,
      userId: session.user.id,
      type: 'image',
      content,
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
    })

    await material.populate('userId', 'name avatar')

    return NextResponse.json({
      id: material._id.toString(),
      type: material.type,
      content: material.content,
      imageUrl: material.imageUrl,
      user: {
        id: (material.userId as any)._id.toString(),
        name: (material.userId as any).name,
        avatar: (material.userId as any).avatar || '',
      },
      createdAt: material.createdAt.toISOString(),
    })
  } catch (error) {
    console.error('Upload image error:', error)
    return NextResponse.json({ error: '上传图片失败' }, { status: 500 })
  }
}
