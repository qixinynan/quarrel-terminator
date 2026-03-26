import { Schema, model, models, Document, Types } from 'mongoose'

export interface IMaterial extends Document {
  groupId: Types.ObjectId
  userId: Types.ObjectId
  type: 'text' | 'image'
  content: string
  title?: string
  imageUrl?: string
  imagePublicId?: string
  createdAt: Date
  updatedAt: Date
}

const materialSchema = new Schema<IMaterial>(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'image'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

materialSchema.index({ groupId: 1, createdAt: -1 })

export const Material = models.Material || model<IMaterial>('Material', materialSchema)
