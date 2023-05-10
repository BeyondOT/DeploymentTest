import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: jwt.Secret;
      REFRESH_TOKEN_SECRET: jwt.Secret;
      PORT: string;
      NODE_ENV: "development" | "production";
      CLIENT_URL: string;
      CLIENT_URL_IP: string;
    }
  }
}
export {};
