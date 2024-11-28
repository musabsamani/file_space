import dotenv from "dotenv";

dotenv.config();

export const apiUrls = {
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
};

// Server port
export const PORT = process.env.PORT || 3000;

// MongoDB URL
export const MONGO_URL = process.env.MONGO_URL;

// JWT secret
export const JWT_SECRET = process.env.JWT_SECRET;

// // supabase url
// export const SUPABASE_URL = process.env.SUPABASE_URL;

// // Supabase key
// export const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
