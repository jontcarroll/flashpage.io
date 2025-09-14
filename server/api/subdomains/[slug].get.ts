import { connectDB } from '../../utils/mongodb'
import { Subdomain } from '../../models/subdomain'

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
    const subdomain = await Subdomain.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      { $inc: { views: 1 } },
      { new: true }
    )
    
    if (!subdomain) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Subdomain not found'
      })
    }
    
    return subdomain
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Error fetching subdomain:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch subdomain'
    })
  }
})