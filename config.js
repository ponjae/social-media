const { DB_USER, DB_USER_PASSWORD } = process.env;

if (!DB_USER || !DB_USER_PASSWORD) {
  throw new Error("Missing MongoDB credentials");
}

export const CONFIG = {
  MONGO_DB: `mongodb+srv://${encodeURIComponent(DB_USER)}:${encodeURIComponent(
    DB_USER_PASSWORD,
  )}@cluster0.9iq7ftv.mongodb.net/social-media?appName=Cluster0`,
};
