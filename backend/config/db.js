const mongoose = require('mongoose');

// Cache the connection across serverless invocations (critical for Vercel)
let cached = global._mongooseConnection;
if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
  // Return cached connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // Return in-progress connection promise if one exists
  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      // Required for Vercel: keep alive and buffer commands while reconnecting
      bufferCommands: false,
    };

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then(m => {
        console.log('✅ MongoDB connected');
        return m;
      })
      .catch(err => {
        cached.promise = null; // reset so next call retries
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
