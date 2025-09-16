import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  if (isConnected) {
    return
  }

  // Build MongoDB URI with URL-encoded password to handle special characters
  let mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    // Use localhost for development, mongodb hostname for Docker
    const isDocker = process.env.NODE_ENV === 'production'
    const defaultUri = isDocker
      ? 'mongodb://admin:localpassword@mongodb:27017/flashpage?authSource=admin'
      : 'mongodb://admin:localpassword@localhost:27017/flashpage?authSource=admin'
    mongoUri = defaultUri
  } else {
    // URL-encode password if building from environment variables
    const mongoPassword = process.env.MONGO_PASSWORD
    if (mongoPassword) {
      const encodedPassword = encodeURIComponent(mongoPassword)
      mongoUri = mongoUri.replace('${MONGO_PASSWORD}', encodedPassword)
    }
  }
  
  try {
    console.log('Attempting to connect to MongoDB at:', mongoUri)
    await mongoose.connect(mongoUri)
    isConnected = true
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    console.error('Attempted URI:', mongoUri)
    throw error
  }
}