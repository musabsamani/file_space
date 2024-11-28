import express from "express";
import { logging } from "./config/logging";
import { database } from "./config/database";
import { router } from "./app";
import winston from "winston";
import dotenv from "dotenv";
import { Server } from "http";

// load environment variables
dotenv.config();

// create express app
const app = express();

// Server port
const PORT = process.env.PORT || 3000;

// for creating the server and export it for later testing
export let server: Server;

try {
  /**
   * Initializes the logging for the application.
   *
   * This includes setting up the Winston logger to handle uncaught exceptions,
   * logging levels, and ensuring logs are handled correctly based on the environment.
   */
  logging();

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
    winston.info(`Server running on port ${PORT}`);
  });
} catch (err) {
  winston.error("Failed to start the server", err);
}

// Global error handlers for uncaught exceptions and unhandled promise rejections

// Unhandled Promise Rejection
process.on("unhandledRejection", (reason: any) => {
  winston.error("Unhandled Rejection:", reason);
  // Optional: You might want to exit the process here, depending on your use case
  // process.exit(1);
});

// Uncaught Exception
process.on("uncaughtException", (error: Error) => {
  winston.error("Uncaught Exception:", error);
  // Optional: You might want to exit the process here, depending on your use case
  // process.exit(1);
});
