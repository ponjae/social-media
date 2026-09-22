import { Post } from "../../models/Post.js";

const resolvers = {
  Query: {
    getPosts: async () => {
      try {
        return await Post.find();
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
    createPost: async (_, { body }) => {
      try {
        const newPost = new Post({
          body,
          createdAt: new Date().toISOString(),
        });
        const res = await newPost.save();
        return res;
      } catch (err) {
        throw new Error(err);
      }
    },
    deletePost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error("Post not found");
        }
        await post.delete();
        return "Post deleted successfully";
      } catch (err) {
        throw new Error(err);
      }
    },
    updatePost: async (_, { postId, body }) => {
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error("Post not found");
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
