import { connectDB } from '../../../utils/mongodb'
import { Flashpage } from '../../../models/flashpage'

export default defineEventHandler(async (event) => {
  await connectDB()

  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug parameter is required'
    })
  }

  try {
    const existing = await Flashpage.findOne({ slug: slug.toLowerCase() })

    return {
      available: !existing,
      slug: slug.toLowerCase()
    }
  } catch (error) {
    console.error('Error checking subdomain availability:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to check availability'
    })
  }
})