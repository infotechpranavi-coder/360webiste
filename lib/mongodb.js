import mongoose from 'mongoose';

const MONGODB_OPTIONS = {
  bufferCommands: true,
  serverSelectionTimeoutMS: 20000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 10000,
};

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { promise: null, listenersAttached: false };
}

function resetCache() {
  cached.promise = null;
}

function attachListeners() {
  if (cached.listenersAttached) return;
  cached.listenersAttached = true;

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected — clearing connection cache');
    resetCache();
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
    resetCache();
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectDB(retries = 3) {
  const MONGODB_URI = process.env.MONGODB_URI?.trim();

  if (!MONGODB_URI) {
    console.warn('MONGODB_URI not defined. Running in demo mode.');
    return null;
  }

  attachListeners();

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Await in-flight connect from a concurrent invocation
  if (mongoose.connection.readyState === 2 && cached.promise) {
    try {
      await cached.promise;
      if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
      }
    } catch {
      resetCache();
    }
  }

  // Drop stale cache when the previous connection is no longer active
  if (cached.promise && mongoose.connection.readyState !== 1) {
    resetCache();
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (!cached.promise) {
        cached.promise = mongoose
          .connect(MONGODB_URI, MONGODB_OPTIONS)
          .then((connection) => {
            console.log('✅ MongoDB connected');
            return connection;
          })
          .catch((error) => {
            resetCache();
            throw error;
          });
      }

      await cached.promise;

      if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
      }

      resetCache();
    } catch (error) {
      resetCache();
      console.error(
        `❌ MongoDB connection failed (attempt ${attempt}/${retries}):`,
        error.message
      );
      if (attempt < retries) {
        await sleep(400 * attempt);
      }
    }
  }

  return null;
}

export const isConnected = () => mongoose.connection.readyState === 1;

export function getDbUnavailableReason() {
  if (!process.env.MONGODB_URI?.trim()) {
    return 'MONGODB_URI is missing. Add it to Vercel Environment Variables, then redeploy.';
  }
  return 'MongoDB connection timed out. Please try again in a few seconds.';
}

/** Use on write endpoints — retries more aggressively before failing. */
export async function ensureConnected(retries = 5) {
  const connection = await connectDB(retries);
  return Boolean(connection && isConnected());
}

export default connectDB;
