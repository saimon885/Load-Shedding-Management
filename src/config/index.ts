import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export default {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  server_url: process.env.SERVER_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRE_IN!,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN!,
  redis_username: process.env.REDIS_USERNAME!,
  redis_password: process.env.REDIS_PASSWORD!,
  redis_host: process.env.REDIS_HOST!,
  redis_port: process.env.REDIS_PORT!,
};
