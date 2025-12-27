import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  WEB_URL: process.env.WEB_URL || "http://localhost:3000",
  MOBILE_URL: process.env.MOBILE_URL || "",
};
