import mongoose from 'mongoose'
import type { ISubdomain } from '../../types'
const { Schema, model, models } = mongoose

const SubdomainSchema = new Schema<ISubdomain>({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9-]+$/,
    minlength: 3,
    maxlength: 50
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  gifUrl: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    default: 'aurora',
    enum: ['aurora', 'ocean', 'sunset', 'forest']
  },
  isDarkMode: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  }
})

SubdomainSchema.index({ slug: 1 })
SubdomainSchema.index({ createdAt: -1 })

export const Subdomain = (models.Subdomain as mongoose.Model<ISubdomain>) || model<ISubdomain>('Subdomain', SubdomainSchema)