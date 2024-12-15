import { Request, Response } from "express";
import { createResponseObject } from "../utils/createResponseObject";

/**
 * Handles undefined API endpoints by returning a 404 status code and a JSON response
 * containing an error message with details about the endpoint that was not found.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const handleUndefinedEndpoints = (req: Request, res: Response) => {
  res.status(404).json(
    createResponseObject({
      error: {
        message: "API endpoint not found",
        details: `Path '${req.method}: ${req.originalUrl}' not found on server routes`,
      },
    })
  );
};
