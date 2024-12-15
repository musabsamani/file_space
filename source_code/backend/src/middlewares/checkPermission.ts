import { NextFunction, Response } from "express";
import { ActionType, CustomRequest } from "../interfaces";
import { FileModel } from "../models/fileModel";
import { Schema } from "mongoose";
import { HttpError, IHttpError } from "../errors/HttpError";
import { createLogObject } from "../utils/createLogObject";
import { customLogger } from "../utils/logger";
import { filePrivacyObject } from "../config/enums";
import { handleControllerErrors } from "../utils/handleControllerErrors";

/**
 * @interface ICheckPermission
 * Interface representing the parameters for the checkPermission function.
 *
 * @property {boolean} [shouldBeOwner=true] - privacy settings to enforce owner access only.
 */
interface ICheckPermission extends ActionType {
  shouldBeOwner?: boolean;
}

/**
 * Middleware to check permissions for accessing a file.
 *
 * @param {ICheckPermission} params - The parameters for the permission check.
 * @param {boolean} [params.shouldBeOwner=false] - Indicates if the user should be the owner of the file.
 * @param {string} params.action - The action being performed (e.g., "access", "update").
 * @param {string} params.resource - The resource being accessed (e.g., "file").
 * @returns Middleware function to check permissions.
 */
export const checkPermission = ({ shouldBeOwner = false, action, resource }: ICheckPermission) => {
  return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void | never> => {
    const fileId = req.params.id as unknown as Schema.Types.ObjectId;
    const userId = req.user?._id;

    try {
      const existingFile = await FileModel.findOne({ _id: fileId });
      if (!existingFile) {
        throw new HttpError({ message: "File not found", statusCode: 404 });
      }

      const isOwner = String(existingFile.owner) === String(userId);

      // if the user is the owner of the file, no need to check further
      // if not is the owner, check the privacy settings of the file
      if (!isOwner) {
        // if should be owner is true and user is not the owner throw error
        if (shouldBeOwner) {
          throw new HttpError({ message: "user is not the owner of this file", statusCode: 403 });
        }
        const privacy = existingFile.privacy;

        switch (privacy) {
          case filePrivacyObject.PUBLIC: {
            // if file is public, no need to check further
            break;
          }
          case filePrivacyObject.RESTRICTED:
            {
              // if user is not authenticated, throw error
              if (!userId) {
                throw new HttpError({ message: "user is not authenticated", statusCode: 401 });
              }
              // if file is restricted, check if user is in the blocked list
              // restricted files are files that are available to all authenticated users except those in the blocked list
              const isBlocked = existingFile.blockedUsers?.includes(userId) ? true : false;
              if (isBlocked) {
                throw new HttpError({
                  message: "User is in the block list of this file",
                  statusCode: 403,
                });
              }
            }
            break;
          case filePrivacyObject.PRIVATE:
            {
              console.log("private file");
              console.log("private file");
              console.log("private file");

              // if user is not authenticated, throw error
              if (!userId) {
                throw new HttpError({ message: "user is not authenticated", statusCode: 401 });
              }
              const isInvited = existingFile.invitedUsers?.includes(userId) ? true : false;
              if (!isInvited) {
                throw new HttpError({
                  message: "user is not in the invitedUsers list of this file",
                  statusCode: 403,
                });
              }
            }
            break;
        }
      }

      // log the successful permission check
      customLogger.audit(
        createLogObject({
          when: "checkPermission Middleware",
          status: "Granted Access",
          action,
          resource,
        })
      );
      next();
    } catch (err) {
      const error = err as IHttpError;
      customLogger.audit(
        createLogObject({
          when: "checkPermission Middleware",
          status: "Rejected Access",
          action,
          resource,
          error,
        })
      );
      handleControllerErrors({ res, error, defaultErrorMessage: "Unauthorized: user doesn't have sufficient permissions to access this file" });
    }
  };
};
