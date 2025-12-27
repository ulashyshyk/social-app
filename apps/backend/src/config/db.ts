import mongoose from 'mongoose';
import { env } from './env';

export async function connectDB() {
  try {
    if (!env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }

    await mongoose.connect(env.MONGO_URI);

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}
