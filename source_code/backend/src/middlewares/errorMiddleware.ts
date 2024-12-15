import { NextFunction, Request, Response } from "express";
import { createResponseObject } from "../utils/createResponseObject";
import { logger } from "../utils/logger";
import { createLogObject } from "../utils/createLogObject";
import { HttpError } from "../errors/HttpError";

/**
 * @function errorMiddleware
 * it used as a middleware to handle errors in the Express application and sends a response to the client
 *
 * it Handles and logs errors in the Express application and sends a response
 * with a 500 status code and a JSON object describing the error.
 *
 * @param {Error} error - The error to log and handle.
 * @param {Request} req - The request object from Express.
 * @param {Response} res - The response object from Express.
 * @param {NextFunction} next - The next function from Express
 */
export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  // Log the error
  logger.error(
    createLogObject({
      when: "errorMiddleware",
      status: "fail",
      action: "handleError",
      resource: "server",
      error,
    })
  );
  if (error instanceof HttpError) {
    res.status(error.statusCode || 500).json({ message: error.message, details: error.details });
  } else {
    res.status(500).json({ message: "Internal Server Error", details: error?.message });
  }
};
