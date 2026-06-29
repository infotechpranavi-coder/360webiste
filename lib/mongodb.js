import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { promise: null };
}

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI?.trim();

  if (!MONGODB_URI) {
    console.warn('MONGODB_URI not defined. Running in demo mode.');
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 15000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((connection) => {
        console.log('✅ MongoDB connected');
        return connection;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection failed:', error.message);
        cached.promise = null;
        throw error;
      });
  }

  try {
    await cached.promise;
    return mongoose.connection.readyState === 1 ? mongoose.connection : null;
  } catch {
    cached.promise = null;
    return null;
  }
}

export const isConnected = () => mongoose.connection.readyState === 1;

export default connectDB;
