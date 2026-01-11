import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI environment variable');
}

export const client = new MongoClient(MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
});

/**
 * Global is used here to maintain a cached connection
 * across hot reloads in development and across lambda invocations.
 */
interface MongoClientCache {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoClient: MongoClientCache | undefined;
}

let cachedClient = global.mongoClient;

if (!cachedClient) {
  cachedClient = global.mongoClient = { client: null, promise: null };
}

export async function connectMongoDB(): Promise<MongoClient> {
  if (cachedClient!.client) {
    console.log('mongo client already connected to db.');
    return cachedClient!.client;
  }

  if (!cachedClient!.promise) {
    console.log('mongo client connecting to db...');
    cachedClient!.promise = client.connect();
  }

  cachedClient!.client = await cachedClient!.promise;
  console.log('mongo client connected to db.');
  return cachedClient!.client;
}

// export async function disconnectMongoDB(): Promise<void> {
//   if (cachedClient!.client) {
//     await cachedClient!.client.close();
//     cachedClient!.client = null;
//     cachedClient!.promise = null;
//   }
// }

export const db = client.db();
