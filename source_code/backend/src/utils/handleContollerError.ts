import { Response } from "express";
import { createResponseObject } from "./createResponseObject";
import { HttpError } from "../errors/HttpError";

export const handleContollerError = ({ error, res, defaultErrorMessage }: { error: unknown; res: Response; defaultErrorMessage: string }) => {
  if (error instanceof HttpError) {
    return res.status(error.statusCode || 500).json(createResponseObject({ error: { message: defaultErrorMessage, details: error.message } }));
  }
  return res.status(500).json(createResponseObject({ error: { message: defaultErrorMessage, details: "Internal server error" } }));
};
