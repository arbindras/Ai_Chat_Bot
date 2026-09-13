import mongoose from "mongoose";
import { config } from "dotenv";
config();

async function connectToDatabase() {
  const uri = process.env.MONGODB_URL;
  if (!uri) {
    throw new Error("MONGODB_URL is not set in the environment");
  }
  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.error(error);
    throw new Error("Could not connect to MongoDB");
  }
}

async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    throw new Error("Could not disconnect from MongoDB");
  }
}

export { connectToDatabase, disconnectFromDatabase };
