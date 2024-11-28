import mongoose from "mongoose";
import winston from "winston";
import { HttpError } from "../errors/HttpError";
import { MONGO_URL } from "./index";

/**
 * Establishes a connection to the MongoDB database using mongoose.
 *
 * This function connects to the database, logs the connection status,
 * and exists the process if the connection fails.
 *
 * @returns {Promise<void>}
 */
export const database = async (): Promise<void> => {
  try {
    // check if MONGO_URL is in the environment variable

    if (!MONGO_URL) {
      throw new HttpError({
        message: "Missing database url in the environment variable",
        details: " MONGO_URL is not defined",
        statusCode: 500,
      });
    }

    // connect to the database
    await mongoose.connect(MONGO_URL);

    // if successful connection log a message to the console
    winston.info("MongoBD Database connected successfully");
  } catch (err) {
    // if connection fails log a message to the console
    winston.error("Failed to connect to database", err);

    // stop the server
    process.exit(1);
  }
};
