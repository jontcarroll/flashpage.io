import { connectDB } from '../../utils/mongodb'
import { Flashpage } from '../../models/flashpage'

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
    const flashpage = await Flashpage.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      { $inc: { views: 1 } },
      { new: true }
    )

    if (!flashpage) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Flashpage not found'
      })
    }

    return flashpage
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Error fetching flashpage:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch flashpage'
    })
  }
})