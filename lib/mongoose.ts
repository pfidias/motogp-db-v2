import mongoose from 'mongoose';

// export const connectMongoose = async () => {
//   console.log(mongoose.connection.readyState);
//   if (mongoose.connection.readyState === 1) {
//     console.log('Already connected to database');
//     return;
//   }

//   await mongoose.connect(process.env.MONGODB_URI!);
//   console.log('Connected to DB with mongoose.');
//   console.log(mongoose.connection.readyState);
// };

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI environment variable');
}

/**
 * Module level caching ensures single mongoose connection across hot reloads in development and across lambda invocations.
 **/
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let cached: MongooseCache = {
  conn: null,
  promise: null,
};

export async function connectMongoose(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log('mongoose already connected to db.');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts);
    console.log('mongoose connecting to db...');
  }

  try {
    cached.conn = await cached!.promise;
    console.log(
      'mongoose connected to db with readyState:',
      mongoose.connection.readyState,
    );
  } catch (error) {
    console.error('Error connecting to mongoose:', error);
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export { mongoose };
