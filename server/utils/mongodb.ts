import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  if (isConnected) {
    return
  }

  // Use localhost for development, mongodb hostname for Docker
  const isDocker = process.env.NODE_ENV === 'production'
  const defaultUri = isDocker
    ? 'mongodb://admin:localpassword@mongodb:27017/flashpage?authSource=admin'
    : 'mongodb://admin:localpassword@localhost:27017/flashpage?authSource=admin'

  const mongoUri = process.env.MONGODB_URI || defaultUri
  
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