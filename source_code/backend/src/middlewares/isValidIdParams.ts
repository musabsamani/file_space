import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/HttpError";
import { handleControllerErrors } from "../utils/handleControllerErrors";
import mongoose, { Schema } from "mongoose";

/**
 * Middleware function to validate the presence and format of the `id` parameter in the request.
 *
 * If the `id` is required to be a number, it checks whether the `id` is a valid number.
 *
 * If validation fails, it throws an HttpError and handles the error response.
 *
 * @param {Object} options - Options for the validation.
 * @param {boolean} [options.isNumber=false] - Indicates whether the `id` must be a valid number. Defaults to false.
 * @returns A middleware function that processes the request.
 *
 * @throws {HttpError} Throws an HttpError if the `id` is missing or invalid.
 */
export const isValidIdParams = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new HttpError({ message: "missing id in the request parameters", statusCode: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpError({ message: "invalid id in the request parameters", statusCode: 400 });
    }

    next();
  } catch (err) {
    handleControllerErrors({ error: err, res, defaultErrorMessage: "Error while validating id in the request parameters" });
  }
};
