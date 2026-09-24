import { AuthenticationError } from "apollo-server";

import jwt from "jsonwebtoken";
import CONFIG from "../config.js";

/**
 * Checks the authorization header for a valid JWT token and returns the authenticated user.
 *
 * @param {object<{ req: { headers: { authorization: string } } }> } context The context object containing the request headers.
 *
 * @returns The authenticated user object if the token is valid, otherwise throws an error.
 *
 * @throws Error if the token is invalid or missing.
 */
const checkAuth = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, CONFIG.JWT_SECRET);
        return user;
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]'");
  }
  throw new Error("Authorization header must be provided");
};

export default checkAuth;
