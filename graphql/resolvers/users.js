import { UserInputError } from "apollo-server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Config from "../../config.js";
import { User } from "../../models/User.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../../util/validators.js";

const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    Config.JWT_SECRET,
    { expiresIn: "1h" },
  );

const resolvers = {
  Mutation: {
    login: async (_, { username, password }) => {
      const { errors, valid } = validateLoginInput(username, password);

      // Validate user input
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });

      // Check if user exists
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      // Check if password matches
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    register: async (
      _,
      { registerInput: { username, email, password, confirmPassword } },
    ) => {
      // Validate user input
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword,
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // Check if username already exists
      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError("Username is already taken", {
          errors: {
            username: "This username is already taken",
          },
        });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();
      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};

export default resolvers;
