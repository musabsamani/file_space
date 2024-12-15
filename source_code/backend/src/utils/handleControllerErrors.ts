import { Response } from "express";
import { createResponseObject } from "./createResponseObject";
import { HttpError } from "../errors/HttpError";
import { LogLevelType } from "../interfaces";
import { logLevelObject } from "../config/enums";
import { configDotenv } from "dotenv";
import { logger } from "./logger";
import { createLogObject } from "./createLogObject";

// load environment variables
configDotenv();

interface IhandleControllerErrors {
  error: unknown;
  res: Response;
  defaultErrorMessage: string;
  when?: string;
  action?: string;
  resource?: string;
  shouldLog?: boolean;
}
/**
 * Handles errors that occur in controller functions.
 * Logs the error based on the specified log level and sends an appropriate response to the client.
 *
 * @param {Object} params - The parameters for handling the error.
 * @param {unknown} params.error - The error object that was thrown.
 * @param {Response} params.res - The Express response object used to send the response.
 * @param {string} params.defaultErrorMessage - A default error message to return if the error does not have a specific message.
 * @param {LogLevelType} params.shouldLog - if set to false, the error will not be logged.
 *
 * @returns {void} This function does not return a value. It sends a response to the client.
 *
 * @throws Throws an error if the logging fails (though this is not explicitly handled in this function).
 */
export const handleControllerErrors = ({ error, res, defaultErrorMessage, when, action, resource, shouldLog = true }: IhandleControllerErrors): void => {
  // Log the error using winston
  // if log level is set to `"null"`, skip and do not log
  if (!shouldLog) {
    // Log the error
    logger.error(
      createLogObject({
        status: "fail",
        when: when || "handleControllerErrors",
        action: action || "handleControllerErrors",
        resource: resource || "handleControllerErrors",
        error,
      })
    );
    logger.error((error as Error)?.message || defaultErrorMessage, error);
  }
  if (error instanceof HttpError) {
    res.status(error.statusCode || 500).json(createResponseObject({ error: { message: defaultErrorMessage, details: error.message } }));
  } else {
    res.status(500).json(createResponseObject({ error: { message: defaultErrorMessage, details: "Internal server error" } }));
  }
};
