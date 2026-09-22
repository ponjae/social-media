import { model, Schema } from "mongoose";

const postSchema = new Schema({
  body: { type: String, required: true },
  username: { type: String, required: true },
  createdAt: { type: String },
  updatedAt: { type: String },
  comments: [
    {
      body: { type: String, required: true },
      username: { type: String, required: true },
      createdAt: { type: String },
    },
  ],
  likes: [
    {
      username: { type: String, required: true },
      createdAt: { type: String },
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Post = model("Post", postSchema);
