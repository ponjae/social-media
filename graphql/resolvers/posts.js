import { AuthenticationError, UserInputError } from "apollo-server";

import { Post } from "../../models/Post.js";
import { User } from "../../models/User.js";
import checkAuth from "../../util/check-auth.js";

const resolvers = {
  Post: {
    avatar: async (post) => {
      const author = post.user;
      if (!author) {
        return null;
      }

      if (author.avatar !== undefined) {
        return author.avatar;
      }

      if (post.populated?.("user")) {
        return null;
      }

      const user = await User.findById(author).select("avatar");
      return user?.avatar ?? null;
    },
  },
  Query: {
    getPosts: async () => {
      try {
        return await Post.find()
          .populate("user", "avatar")
          .sort({ createdAt: -1 });
      } catch (err) {
        throw new Error(err);
      }
    },
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId).populate("user", "avatar");
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

      if (body.trim() === "") {
        throw new UserInputError("Post body must not be empty", {
          errors: {
            body: "Post body must not be empty",
          },
        });
      }

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

        await post.deleteOne();
        return "Post deleted successfully";
      } catch (err) {
        throw new Error(err);
      }
    },
    updatePost: async (_, { postId, body }, context) => {
      // Check if the user is authenticated
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Post body must not be empty", {
          errors: {
            body: "Post body must not be empty",
          },
        });
      }

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
    toggleLikePost: async (_, { postId }, context) => {
      const user = checkAuth(context);
      const post = await Post.findById(postId);

      if (!post) {
        throw new UserInputError("Post not found");
      }

      const likeIndex = post.likes.findIndex(
        (like) => like.username === user.username
      );

      if (likeIndex === -1) {
        post.likes.push({
          username: user.username,
          createdAt: new Date().toISOString(),
        });
      } else {
        post.likes.splice(likeIndex, 1);
      }

      return post.save();
    },
  },
};

export default resolvers;
