import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await client.connect();
    const db = client.db("test-db");
    const collection = db.collection("test-collection");

    const result = await collection.insertOne({ timestamp: new Date() });

    res.status(200).json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  } finally {
    await client.close();
  }
}
