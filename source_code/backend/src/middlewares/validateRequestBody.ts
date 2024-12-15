import { NextFunction, Request, Response } from "express";
import { createResponseObject } from "../utils/createResponseObject";
import Joi from "joi";
import { HttpError } from "../errors/HttpError";
import { handleControllerErrors } from "../utils/handleControllerErrors";

/**
 * Validate the request body against the given validation schema.
 *
 * If the request body is valid, assigns the validated value to the request body.
 *
 * If the request body is invalid, throws an HttpError with a status code of 400.
 *
 * @remark this middleware ***strips unknown fields*** in the rquest body
 *
 * @param {Joi.Schema} validationSchema - The validation schema to validate the request body against.
 * @param {Joi.Schema} requireNonEmptyBody - If true, the request body must not be empty. Default is true.
 * @returns - The middleware function.
 */
export const validateRequestBody = (validationSchema: Joi.Schema, requireNonEmptyBody = true) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      console.log({ body });
      // Check if the requireNonEmptyBody option is true
      if (requireNonEmptyBody) {
        // Check if request body is empty
        if (Object.keys(body).length === 0) {
          throw new HttpError({ message: "request body is empty", statusCode: 400 });
        }
      }

      // Validate request body against the validation schema
      const { value, error } = validationSchema.validate(body, {
        // Remove unknown fields in the body - fields that are not defined in the validation schema
        stripUnknown: true,
      });

      // throw error if request body is invalid
      // details will contain the error message for the first invalid field
      if (error) {
        throw new HttpError({ message: error.details[0].message, statusCode: 400 });
      }

      // Assign the validated value to the request body
      req.body = value;

      // If request body is valid, move to the next middleware
      next();
    } catch (error) {
      handleControllerErrors({ error, res, defaultErrorMessage: "Invalid request body", when: "validateRequestBody middleware" });
    }
  };
};
