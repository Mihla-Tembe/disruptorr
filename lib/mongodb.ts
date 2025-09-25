import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI!;
const options = {
  // Add any custom options here
};

let client: MongoClient;

// Use globalThis to avoid TypeScript errors
const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
};

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(uri, options);
  attachDatabasePool(client);
}

export default client;
