import { Error as MongooseError } from "mongoose";
import { MongoServerError } from "mongodb"; // Explicit import for MongoServerError
import { HttpError } from "../errors/HttpError";

/**
 * Handles errors that occur during Mongoose database operations.
 * @param  message A generic error message that describes the operation that failed.
 * @param error The error object that was thrown by the database operation.
 * @returns {never} This function will always throw an HttpError.
 * @throws {HttpError} The error that occurred during the database operation, converted to an HttpError.
 */
export const handleDatabaseError = ({ defaultMessage, error }: { defaultMessage: string; error: unknown }): never => {
  if (error instanceof MongooseError.ValidationError) {
    // Handle validation errors
    const details = Object.values(error.errors)
      .map((err) => err.message)
      .join(", ");
    throw new HttpError({
      message: "Validation error",
      details,
      statusCode: 400,
      stack: error.stack,
    });
  }

  if (error instanceof MongooseError.CastError) {
    // Handle invalid ID or type casting errors
    throw new HttpError({
      message: `Invalid value for field '${error.path}'`,
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
          message: `Duplicate key error: ${fields}`,
          details: error.message,
          statusCode: 400,
          stack: error.stack,
        });

      default:
        // General MongoDB server error
        throw new HttpError({
          message: "Database server error",
          details: error.message,
          statusCode: 500,
          stack: error.stack,
        });
    }
  }

  // Handle general HttpError instances
  if (error instanceof HttpError) {
    throw new HttpError({ message: error.message, details: error.details, statusCode: error.statusCode });
  }

  // Default error handling for unknown errors
  throw new HttpError({
    message: defaultMessage,
    details: error instanceof Error ? error.message : "Unknown error",
    statusCode: 500,
    stack: error instanceof Error ? error.stack : undefined,
  });
};
