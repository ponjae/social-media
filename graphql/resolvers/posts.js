import { AuthenticationError } from "apollo-server";

import { Post } from "../../models/Post.js";
import checkAuth from "../../util/check-auth.js";

const resolvers = {
  Query: {
    getPosts: async () => {
      try {
        return await Post.find().sort({ createdAt: -1 });
      } catch (err) {
        throw new Error(err);
      }
    },
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error("Post not found");
        }
        return post;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    createPost: async (_, { body }, context) => {
      // Check if the user is authenticated
      const user = checkAuth(context);

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      try {
        const res = await newPost.save();
        return res;
      } catch (err) {
        throw new Error(err);
      }
    },
    deletePost: async (_, { postId }, context) => {
      // Check if the user is authenticated
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error("Post not found");
        }
        // Only the user who created the post can delete it.
        if (post.username !== user.username) {
          throw new AuthenticationError("Action not allowed");
        }

        await post.delete();
        return "Post deleted successfully";
      } catch (err) {
        throw new Error(err);
      }
    },
    updatePost: async (_, { postId, body }, context) => {
      // Check if the user is authenticated
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error("Post not found");
        }

        // Only the user who created the post can update it.
        if (post.username !== user.username) {
          throw new AuthenticationError("Action not allowed");
        }

        post.body = body;
        const res = await post.save();
        return res;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

export default resolvers;
