import { NextFunction, Response } from "express";
import { handleControllerErrors } from "../utils/handleControllerErrors";
import { createLogObject } from "../utils/createLogObject";
import { customLogger } from "../utils/logger";
import { ActionType, CustomRequest, UserRoleType } from "../interfaces";
import { HttpError } from "../errors/HttpError";
import { IUserToken } from "../interfaces/IUser";
import { logLevelObject, userRoleObject } from "../config/enums";
import { Schema } from "mongoose";

interface ICheckRole extends ActionType {
  allowedRoles?: UserRoleType[];
  userId?: Schema.Types.ObjectId;
}

/**
 * Middleware function to authorize users based on their roles.
 * This middleware checks if the user is authenticated and has the required role
 * to access the specified resource. If authorization fails, it logs the error
 * and sends an unauthorized response 403 Forbidden.
 *
 * @param {ICheckRole} options - Options for the authorization.
 * @param {UserRoleType} [options.allowedRoles] - The roles allowed to access the resource. Defaults to 'admin'.
 * @param {string} options.action - The action being performed that requires authorization.
 * @param {string} options.resource - The resource being accessed that requires authorization.
 * @param {string} [options.userId] - The ID of the user being authorized (optional).
 * @returns A middleware function that processes the request.
 *
 * @throws Throws an HttpError if the user is not authenticated or does not have sufficient privileges.
 */
export const checkUserRole = ({ allowedRoles = [userRoleObject.ADMIN], action, resource, userId }: ICheckRole) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    let userId = user?._id;
    try {
      // Check if the user is authenticated
      if (!user || Object.keys(user).length === 0) {
        throw new HttpError({ message: "Unauthenticated user: Missing user in the request object", statusCode: 401 });
      }

      // Check if the user has the required role
      if (!allowedRoles.includes(user.userRole)) {
        throw new HttpError({ message: "user does not have sufficient privileges to access this resource", statusCode: 403 });
      }

      // If authorization is successful, move to the next middleware
      // the log will be created by the next middleware
      next();
    } catch (error) {
      customLogger.audit(
        createLogObject({
          when: "checkUserRole Middleware: checking user authorization",
          status: "failed",
          action,
          error,
          resource,
          userId: userId || userId,
        })
      );
      handleControllerErrors({ shouldLog: false, error, res, defaultErrorMessage: "Unauthorized" });
    }
  };
};
