import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export const env = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  WEB_URL: process.env.WEB_URL,
  MOBILE_URL: process.env.MOBILE_URL,
};