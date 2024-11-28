import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/HttpError";
import { handleContollerError } from "../utils/handleContollerError";
import { extractTokenFromHeader, verifyToken } from "../utils/jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract the JWT token from the request header
    const token = extractTokenFromHeader(req);

    // Verify the JWT token
    const decoded = verifyToken(token);

    (req as any).user = decoded;
    // if token verification is successful, move to the next middleware
    next();
  } catch (error) {
    handleContollerError({ error, res, defaultErrorMessage: "Unauthorized" });
  }
};
