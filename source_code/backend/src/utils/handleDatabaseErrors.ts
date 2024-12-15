import { Error as MongooseError } from "mongoose";
import { MongoServerError } from "mongodb"; // Explicit import for MongoServerError
import { HttpError } from "../errors/HttpError";
import winston from "winston";
import { LogLevelType } from "../interfaces";
import { logLevelObject } from "../config/enums";
import { configDotenv } from "dotenv";
import { logger } from "./logger";

// load environment variables
configDotenv();

/**
 * Handles errors that occur during database service functions and Mongoose operations.
 *
 * This function logs the error and throws an `HttpError` with appropriate details based on the type of error encountered.
 *
 * @param {Object} params - The parameters for handling database errors.
 * @param {string} params.defaultErrorMessage - A generic error message describing the failed operation.
 * @param {unknown} params.error - The error object thrown by the database operation.
 * @param {LogLevelType} [params.logLevel=logLevelObject.INFO] - The log level for logging the error. If set to `"null"`, logging is skipped.
 *
 * @throws {HttpError} Throws an `HttpError` with details about the database operation error.
 *
 * @returns {never} This function always throws an `HttpError` and never returns.
 */
export const handleDatabaseErrors = ({ defaultErrorMessage, error, logLevel = logLevelObject.INFO }: { defaultErrorMessage: string; error: unknown; logLevel?: LogLevelType }): never => {
  // Log the error using winston
  // if log level is set to `"null"`, skip and do not log
  if (logLevel !== "null") logger[logLevel]((error as Error).message || defaultErrorMessage, error);

  if (error instanceof MongooseError.ValidationError) {
    // Handle validation errors
    const details = Object.values(error.errors)
      .map((err) => err.message)
      .join(", ");
    throw new HttpError({
      message: "Database: Validation error",
      details,
      statusCode: 400,
      stack: error.stack,
    });
  }

  if (error instanceof MongooseError.CastError) {
    // Handle invalid ID or type casting errors
    throw new HttpError({
      message: `Database: Invalid value for field '${error.path}'`,
      details: error.message,
      statusCode: 400,
      stack: error.stack,
    });
  }

  if (error instanceof MongoServerError) {
    // Use MongoDB-specific errors
    switch (error.code) {
      case 11000:
        // Handle duplicate key error
        const fields = Object.keys(error.keyValue).join(", ");
        throw new HttpError({
          message: `Database: Duplicate key error: ${fields}`,
          details: error.message,
          statusCode: 400,
          stack: error.stack,
        });

      default:
        // General MongoDB server error
        throw new HttpError({
          message: "Database: Database server error",
          details: error.message,
          statusCode: 500,
          stack: error.stack,
        });
    }
  }

  // Catch errors thrown by the logic of the database service functions
  // Rethrow the error to be handled by the next error handler 'controllerErrorHandler'
  if (error instanceof HttpError) {
    throw new HttpError({ message: error.message, details: error.details, statusCode: error.statusCode });
  }

  // Default error handling for unknown errors
  throw new HttpError({
    message: defaultErrorMessage,
    details: error instanceof Error ? error.message : "Unknown error",
    statusCode: 500,
    stack: error instanceof Error ? error.stack : undefined,
  });
};
