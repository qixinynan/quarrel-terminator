import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Group, IGroup } from '@/lib/models/Group'
import { Material, IMaterial } from '@/lib/models/Material'
import GroupClient from './GroupClient'

interface Props {
  params: { id: string }
}

interface PopulatedMember {
  _id: { toString(): string }
  name: string
  email: string
  avatar?: string
}

interface PopulatedCreator {
  _id: { toString(): string }
  name: string
}

interface PopulatedGroup extends Omit<IGroup, 'members' | 'creatorId'> {
  members: PopulatedMember[]
  creatorId: PopulatedCreator
}

interface PopulatedMaterial extends Omit<IMaterial, 'userId'> {
  userId: {
    _id: { toString(): string }
    name: string
    avatar?: string
  }
}

export default async function GroupPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  await connectDB()

  const group = await Group.findById(params.id)
    .populate('members', 'name email avatar')
    .populate('creatorId', 'name email')
    .lean<PopulatedGroup>()

  if (!group) {
    notFound()
  }

  const isMember = group.members.some(
    (member) => member._id.toString() === session.user.id
  )

  if (!isMember) {
    redirect('/dashboard')
  }

  const materials = await Material.find({ groupId: params.id })
    .populate('userId', 'name avatar')
    .sort({ createdAt: -1 })
    .lean<PopulatedMaterial[]>()

  const serializedGroup = {
    id: group._id.toString(),
    name: group.name,
    description: group.description,
    inviteCode: group.inviteCode,
    status: group.status,
    aiAnalysis: group.aiAnalysis || '',
    members: group.members.map((member) => ({
      id: member._id.toString(),
      name: member.name,
      email: member.email,
      avatar: member.avatar || '',
    })),
    creator: {
      id: group.creatorId._id.toString(),
      name: group.creatorId.name,
    },
    createdAt: group.createdAt.toISOString(),
  }

  const serializedMaterials = materials.map((material) => ({
    id: material._id.toString(),
    type: material.type,
    content: material.content,
    title: material.title || '',
    imageUrl: material.imageUrl || '',
    user: {
      id: material.userId._id.toString(),
      name: material.userId.name,
      avatar: material.userId.avatar || '',
    },
    createdAt: material.createdAt.toISOString(),
  }))

  return <GroupClient group={serializedGroup} materials={serializedMaterials} currentUserId={session.user.id} />
}
