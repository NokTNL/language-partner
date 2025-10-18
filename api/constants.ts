import dotenv from "dotenv";

dotenv.config({ path: "../.env.production" });

export const API_BASE_URL =
  process.env.VITE_API_BASE_URL || "http://localhost:3156";
