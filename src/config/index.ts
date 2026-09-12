import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  server_url: process.env.SERVER_URL,

  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS)!,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRE_IN!,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN!,

  redis_username: process.env.REDIS_USERNAME!,
  redis_password: process.env.REDIS_PASSWORD!,
  redis_host: process.env.REDIS_HOST!,
  redis_port: process.env.REDIS_PORT!,

  smtp_username: process.env.SMTP_USERNAME!,
  email_sender: process.env.EMAIL_SENDER!,
  smtp_password: process.env.SMTP_PASSWORD!,

  admin_name: process.env.ADMIN_NAME!,
  admin_email: process.env.ADMIN_EMAIL!,
  admin_password: process.env.ADMIN_PASSWORD!,

  operator_name: process.env.OPERATOR_NAME!,
  operator_email: process.env.OPERATOR_EMAIL!,
  operator_password: process.env.OPERATOR_PASSWORD!,

  technician_name: process.env.TECHNICIAN_NAME!,
  technician_email: process.env.TECHNICIAN_EMAIL!,
  technician_password: process.env.TECHNICIAN_PASSWORD!,

  zoneManager_name: process.env.ZONEMANAGER_NAME!,
  zoneManager_email: process.env.ZONEMANAGER_EMAIL!,
  zoneManager_password: process.env.ZONEMANAGER_PASSWORD!,
};
