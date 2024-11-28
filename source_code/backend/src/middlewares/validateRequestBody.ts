import { NextFunction, Request, Response } from "express";
import { createResponseObject } from "../utils/createResponseObject";
import Joi from "joi";
import { HttpError } from "../errors/HttpError";

/**
 * Validate the request body against the given validation schema.
 *
 * If the request body is valid, assigns the validated value to the request body.
 * If the request body is invalid, throws an HttpError with a status code of 400.
 *
 * @param {Joi.Schema} validationSchema - The validation schema to validate the request body against.
 * @returns - The middleware function.
 */
export const validateRequestBody = (validationSchema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      // Check if request body is empty
      if (Object.keys(body).length === 0) {
        throw new HttpError({ message: "request body is empty", statusCode: 400 });
      }

      // Validate request body against the validation schema
      const { value, error } = validationSchema.validate(body, {
        stripUnknown: true, // Remove unknown fields in the body
      });

      if (error) {
        throw new HttpError({ message: "Invalid request body", details: error.details[0].message, statusCode: 400 });
      }

      // Assign the validated value to the request body
      req.body = value;

      // If request body is valid, move to the next middleware
      next(); // Ensure void is returned
    } catch (error) {
      // check if error is instance of HttpError (thrown by some middleware which have more error details)
      if (error instanceof HttpError) {
        res.status(400).json(
          createResponseObject({
            error: { message: error.message, details: error.details },
          })
        );
      } else {
        // return internal server error
        res.status(400).json(
          createResponseObject({
            error: { message: "internal server error", details: "error when validate request body" },
          })
        );
      }
    }
  };
};
