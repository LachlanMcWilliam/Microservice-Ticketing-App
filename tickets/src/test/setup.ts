import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signup(userId?: string): string[];
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "ldkjadw";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = (userId?: string) => {
  // Build a JWT payload with format: { id, email }
  const payload = {
    id: userId || "dadwada",
    email: "test@test.com",
  };
  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session object, { jwt: JWT } and transform session to JSON
  const sessionJSON = JSON.stringify({ jwt: token });
  // Take JSON and encode to Base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  // return the cookie plus encoded data in string form
  return [`express:sess=${base64}`];
};
