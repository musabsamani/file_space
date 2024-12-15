import mongoose from "mongoose";
import { HttpError } from "../errors/HttpError";
import { MONGO_URL } from "./env";
import { logger } from "../utils/logger";
import { create } from "domain";
import { createLogObject } from "../utils/createLogObject";

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
    const connection = await mongoose.connect(MONGO_URL);

    // get the host of the connection
    const host = connection.connection.host;

    // if connection success log it
    logger.info(`MongoDB Database connected successfully to host: ${host}`);
    logger.info(
      createLogObject({
        when: "MongoBD Database connection",
        status: "success",
        action: "connect",
        resource: "database",
      })
    );
  } catch (err) {
    // if connection fails log it
    logger.error(
      createLogObject({
        when: "MongoBD Database connection",
        status: "fail",
        action: "connect",
        resource: "database",
        error: err,
      })
    );
    // stop the server
    process.exit(1);
  }
};
