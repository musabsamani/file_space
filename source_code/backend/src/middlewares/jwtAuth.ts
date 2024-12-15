import { NextFunction, Response } from "express";
import { handleControllerErrors } from "../utils/handleControllerErrors";
import { decodeToken, extractTokenFromHeader, verifyToken } from "../utils/jwt";
import { logLevelObject } from "../config/enums";
import { customLogger } from "../utils/logger";
import { createLogObject } from "../utils/createLogObject";
import { ActionType, CustomRequest } from "../interfaces";

interface IJwtAuth extends ActionType {
  skipError?: boolean;
}

/**
 * Middleware function to authenticate users based on JWT tokens.
 * This middleware extracts the token from the request header, verifies it,
 * and decodes it to attach the user information to the request object.
 * If authentication fails, it logs the error and sends an unauthorized response.
 *
 * @property action - The action being performed that requires authentication.
 * @property resource - The resource being accessed that requires authentication.
 * @returns A middleware function that processes the request.
 *
 * @throws Throws an error if the token verification or decoding fails.
 */
export const jwtAuth = ({ skipError = false, action, resource }: IJwtAuth) => {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    try {
      // Extract the JWT token from the request header
      const token = extractTokenFromHeader(req);

      // Verify the JWT token
      verifyToken(token);

      // Decode the token
      const decoded = decodeToken(token);

      // Attach the user object to the request object - so that it can be used in the next middlewares
      req.user = decoded;

      // If token verification is successful, move to the next middleware
      // the log will be created by the next middleware
      next();
    } catch (error) {
      // log the error by winston custom logger to the specific log file `audit.log`
      if (skipError) {
        next();
      } else {
        customLogger.audit(
          createLogObject({
            when: "JWT Auth Middleware: checking user authentication",
            status: "rejected",
            action,
            resource,
            error,
          })
        );
        handleControllerErrors({ shouldLog: false, error, res, defaultErrorMessage: "Unauthorized: User Authentication failed" });
      }
    }
  };
};
