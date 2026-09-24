const { DB_USER, DB_USER_PASSWORD, JWT_SECRET } = process.env;

if (!DB_USER || !DB_USER_PASSWORD || !JWT_SECRET) {
  throw new Error("Missing MongoDB credentials or JWT secret ");
}

export const CONFIG = {
  MONGO_DB: `mongodb+srv://${encodeURIComponent(DB_USER)}:${encodeURIComponent(
    DB_USER_PASSWORD,
  )}@cluster0.9iq7ftv.mongodb.net/social-media?appName=Cluster0`,
  JWT_SECRET,
};

export default CONFIG;
