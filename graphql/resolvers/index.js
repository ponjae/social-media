import postResolvers from "./posts.js";
// import userResolvers from "./users.js";

const resolvers = {
  Query: {
    ...postResolvers.Query,
    // ...userResolvers.Query,
  },
};

export default resolvers;
