import express from "express";
import { configDotenv } from "dotenv";
import { Server } from "http";
import { database } from "./config/database";
import { router } from "./router";
import { logger } from "./utils/logger";
import { PORT } from "./config/env";
import winston from "winston/lib/winston/config";
import { createLogObject } from "./utils/createLogObject";

// load environment variables
configDotenv();

// create express app
const app = express();

// for creating the server and export it for later testing
export let server: Server;

try {
  /**
   * Establishes a connection to the MongoDB database using mongoose.
   *
   * This function connects to the database, logs the connection status,
   */
  database();

  /**
   * Configures routes and middleware for the application.
   *
   * This function sets up the API routes, error handling, and middleware
   * such as CORS and body parsers for handling incoming requests.
   *
   * @param {Application} app - The Express application instance.
   */
  router(app);

  // start server
  server = app.listen(PORT, () => {
    const host = `http://localhost:${PORT}`;
    // if connection success log it

    // logger is used to log info and error using `winston` library
    // createLogObject is used to unify the log format
    logger.info(
      createLogObject({
        when: "server start",
        status: "success",
        action: "start server",
        resource: "server",
      })
    );
    logger.info(`Server running at ${host}`);
  });
} catch (err) {
  // if connection fail log it
  // logger is used to log info and error using `winston` library
  // createLogObject is used to unify the log format
  logger.info(
    createLogObject({
      when: "server start",
      status: "fail",
      action: "start server",
      resource: "server",
      error: err,
    })
  );
  logger.error("Failed to start the server", err);
}

// Global error handlers for uncaught exceptions and unhandled promise rejections

// Unhandled Promise Rejection
process.on("unhandledRejection", (error: any) => {
  // if unhandledRejection occure log it
  logger.info(
    createLogObject({
      when: "unhandledRejection",
      status: "fail",
      action: "process",
      resource: "process",
      error,
    })
  );
  // Optional: if we want to exit the process here, depending on the use case
  // process.exit(1);
});

// Uncaught Exception
process.on("uncaughtException", (error: Error) => {
  // if unhandledRejection occure log it
  logger.info(
    createLogObject({
      when: "uncaughtException",
      status: "fail",
      action: "process",
      resource: "process",
      error,
    })
  );
  // Optional: if we want to exit the process here, depending on the use case
  // process.exit(1);
});
