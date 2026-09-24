import postResolvers from "./posts.js";
import userResolvers from "./users.js";

const resolvers = {
  Query: {
    ...postResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
  },
};

export default resolvers;
