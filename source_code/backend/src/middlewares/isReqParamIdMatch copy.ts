import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/HttpError";
import { handleControllerErrors } from "../utils/handleControllerErrors";

/**
 * Middleware to validate that the ID in the request parameters matches the ID in the request body.
 *
 * This function checks if the `id` specified in the request parameters is equal to the `id` in the request body.
 * If they do not match, it throws an `HttpError` with a 400 status code indicating a bad request.
 *
 * If the IDs match, the middleware calls the `next` function to proceed to the next middleware or controller.
 *
 * @throws Throws a 400 error if the IDs do not match.
 */

export const isReqParamIdMatch = (req: Request, res: Response, next: NextFunction) => {
  try {
    const paramsId = req.params.id;
    const requestId = req.body._id;

    if (paramsId !== requestId) {
      throw new HttpError({ message: "ID in request parameters and request body do not match", statusCode: 400 });
    }

    next(); // Proceed to the next middleware or controller
  } catch (err) {
    handleControllerErrors({ error: err, res, defaultErrorMessage: "Error while validating request parameters and request body ids match" });
  }
};
