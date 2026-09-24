import { UserInputError, AuthenticationError } from "apollo-server";

import { Post } from "../../models/Post.js";
import checkAuth from "../../util/check-auth.js";

const resolvers = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Comment body must not be empty", {
          errors: {
            body: "Comment body must not be empty",
          },
        });
      }

      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });

        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    },
    updateComment: async (_, { postId, commentId, body }, context) => {
      const { username } = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Comment body must not be empty", {
          errors: {
            body: "Comment body must not be empty",
          },
        });
      }

      const post = await Post.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex(
          ({ id }) => id === commentId,
        );
        if (commentIndex !== -1) {
          if (post.comments[commentIndex].username === username) {
            post.comments[commentIndex].body = body;
            await post.save();
            return post;
          } else {
            throw new AuthenticationError("Action not allowed");
          }
        } else {
          throw new Error("Comment not found");
        }
      } else throw new UserInputError("Post not found");
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex(
          ({ id }) => id === commentId,
        );
        if (commentIndex !== -1) {
          if (post.comments[commentIndex].username === username) {
            post.comments.splice(commentIndex, 1);
            await post.save();
            return post;
          } else {
            throw new AuthenticationError("Action not allowed");
          }
        } else {
          throw new Error("Comment not found");
        }
      } else throw new UserInputError("Post not found");
    },
  },
};

export default resolvers;
