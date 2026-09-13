import mongoose from "mongoose";
import { randomUUID } from "crypto";

const chatSchema = new mongoose.Schema({
  id: {
    type: String,
    // NOTE: this must be a function reference, not a call. `randomUUID()`
    // (with parens) would evaluate once when the schema loads and hand
    // every chat message the exact same id. `randomUUID` (no parens) runs
    // fresh for each new subdocument.
    default: randomUUID,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "assistant", "system"],
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  chats: [chatSchema],
});

export default mongoose.model("User", userSchema);
