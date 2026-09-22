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
  },
};

export default resolvers;
