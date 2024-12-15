import { NextFunction, Response } from "express";
import { ActionType, CustomRequest } from "../interfaces";
import { FileModel } from "../models/fileModel";
import { HttpError } from "../errors/HttpError";
import { createLogObject } from "../utils/createLogObject";
import { customLogger } from "../utils/logger";
import { handleControllerErrors } from "../utils/handleControllerErrors";

/**
 * Middleware to check if a file exists in the database.
 *
 * @param {ActionType} params - The parameters for the action and resource.
 * @param {string} params.action - The action being performed (e.g., "read", "write").
 * @param {string} params.resource - The resource being accessed (e.g., "file").
 * @returns Middleware function to check if the file exists.
 */
export const checkFileExist = ({ action, resource }: ActionType) => {
  return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void | never> => {
    const userId = req.user?._id;
    const fileId = req.params.id;
    try {
      const existingFile = await FileModel.findOne({ _id: fileId });
      if (!existingFile) {
        throw new HttpError({ message: `File with the id '${fileId}' not found`, statusCode: 404 });
      }

      next();
    } catch (error) {
      customLogger.audit(
        createLogObject({
          when: "checkFileExist Middleware",
          status: "failed",
          action,
          resource,
          error,
        })
      );
      handleControllerErrors({ res, error, defaultErrorMessage: "file not found" });
    }
  };
};
