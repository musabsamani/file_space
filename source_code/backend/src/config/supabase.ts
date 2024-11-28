// import winston from "winston";
// import { HttpError } from "../errors/HttpError";
// import { SUPABASE_API_KEY, SUPABASE_URL } from "./index";
// import { createClient, SupabaseClient } from "@supabase/supabase-js";

// let supabase: SupabaseClient<any, "public", any> | null = null;

// export const supabaseConnection = async () => {
//   try {
//     // check if SUPABASE_URL is in the environment variable
//     if (!SUPABASE_URL) {
//       throw new HttpError({
//         message: "Missing SUPABASE_URL in the environment variable",
//         details: " SUPABASE_URL is not defined",
//         statusCode: 500,
//       });
//     }

//     // check if SUPABASE_API_KEY is in the environment variable
//     if (!SUPABASE_API_KEY) {
//       throw new HttpError({
//         message: "Missing SUPABASE_API_KEY in the environment variable",
//         details: " SUPABASE_API_KEY is not defined",
//         statusCode: 500,
//       });
//     }

//     // create Supabase client
//     supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

//     // if successful connection log a message to the console
//     winston.info("Supabase client connected successfully");

//     return supabase;
//   } catch (err) {
//     // if connection fails log a message to the console
//     winston.error("Failed to connect to Supabase client", err);

//     // stop the server
//     process.exit(1); // Exit process on failure
//   }
// };

// export default supabase;
