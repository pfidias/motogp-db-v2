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
 * Global is used here to maintain a cached connection
 * across hot reloads in development and across lambda invocations.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend NodeJS global
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectMongoose(): Promise<typeof mongoose> {
  if (cached!.conn) {
    console.log('mongoose already connected to db.');
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    });
    console.log('mongoose connecting to db...');
  }

  cached!.conn = await cached!.promise;
  console.log(
    'mongoose connected to db with readyState:',
    mongoose.connection.readyState,
  );
  return cached!.conn;
}

// export async function disconnectDB(): Promise<void> {
//   if (cached!.conn) {
//     await mongoose.disconnect();
//     cached!.conn = null;
//     cached!.promise = null;
//   }
// }
