import { Schema, model, models, Document, Types } from 'mongoose'

export interface IGroup extends Document {
  name: string
  description: string
  creatorId: Types.ObjectId
  members: Types.ObjectId[]
  inviteCode: string
  status: 'active' | 'analyzing' | 'resolved'
  aiAnalysis?: string
  createdAt: Date
  updatedAt: Date
}

const groupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: [true, '请输入小组名称'],
      trim: true,
      maxlength: [100, '名称不能超过100个字符'],
    },
    description: {
      type: String,
      required: [true, '请输入争端描述'],
      trim: true,
      maxlength: [1000, '描述不能超过1000个字符'],
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    inviteCode: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'analyzing', 'resolved'],
      default: 'active',
    },
    aiAnalysis: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

groupSchema.index({ creatorId: 1 })
groupSchema.index({ inviteCode: 1 })

export const Group = models.Group || model<IGroup>('Group', groupSchema)
