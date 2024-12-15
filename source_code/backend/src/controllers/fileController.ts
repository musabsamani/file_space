import { NextFunction, Request, Response } from "express";
import { FileService } from "../services/fileService";
import { HttpError } from "../errors/HttpError";
import { handleControllerErrors } from "../utils/handleControllerErrors";
import { createResponseObject } from "../utils/createResponseObject";
import { IFileCreateDTO, IFileResponseDTO, IFileUpdateDTO } from "../interfaces/IFile";
import { CustomRequest } from "../interfaces";
import { removeFileFromUploads, removeFilesArrayFromUploads } from "../utils/removeFileFromUploads";
import { Schema } from "mongoose";
import { FileModel } from "../models/fileModel";
import { filePrivacyObject } from "../config/enums";
import { logger } from "../utils/logger";
import { createLogObject } from "../utils/createLogObject";
import { UserModel } from "../models/userModel";

// Instantiate the file service - this will be used to interact with the database FileModel
const fileService = new FileService();

/**
 * @function getFileById
 * Retrieves a file by its ID.
 *
 * @param req - The request object containing the file ID in the parameters.
 * @param res - The response object used to send the file information or an error message.
 *
 * @throws {HttpError} If the file is not found.
 *
 * @returns A promise that resolves when the file information is sent in the response.
 */
export const viewFileById = async (req: Request, res: Response) => {
  try {
    // Get file id from request parameters
    const fileId = req.params.id as unknown as Schema.Types.ObjectId;

    // Get file from database
    const file = await fileService.getFileById({ fileId });

    // Check if file exists
    if (!file) throw new HttpError({ message: "File not found", statusCode: 404 });

    // Return file information
    res.status(200).sendFile(file.path);
  } catch (error) {
    handleControllerErrors({ error, res, defaultErrorMessage: "Could not retrieve a file", when: "viewFileById controller", resource: "file", action: "read" });
  }
};

/**
 * @function getFileById
 * Retrieves a file by its ID.
 *
 * @param req - The request object containing the file ID in the parameters.
 * @param res - The response object used to send the file information or an error message.
 *
 * @throws {HttpError} If the file is not found.
 *
 * @returns A promise that resolves when the file information is sent in the response.
 */
export const getFileById = async (req: Request, res: Response) => {
  try {
    // Get file id from request parameters
    const fileId = req.params.id as unknown as Schema.Types.ObjectId;

    // Get file from database
    const file = await fileService.getFileById({ fileId });

    // Check if file exists
    if (!file) throw new HttpError({ message: "File not found", statusCode: 404 });

    // Return file information
    res.status(200).json(createResponseObject<IFileResponseDTO>({ data: file }));
  } catch (error) {
    handleControllerErrors({ error, res, defaultErrorMessage: "Could not retrieve a file", when: "getFileById controller", resource: "file", action: "read" });
  }
};

/**
 * @function getLoggedInUserFiles
 * Retrieves the files owned by the logged-in user.
 *
 * @param {CustomRequest} req - The request object, containing the user information.
 * @param {Response} res - The response object used to send back the desired HTTP response.
 *
 * @returns - A promise that resolves when the files are successfully retrieved and sent in the response.
 *
 * @throws Will handle any errors that occur during the file retrieval process and send an appropriate error response.
 */
export const getLoggedInUserFiles = async (req: CustomRequest, res: Response) => {
  try {
    // Get file from database
    const userId = req.user?._id!;

    const files = await fileService.getFilesByOwnerId({ userId });

    // Return file information
    res.status(200).json(createResponseObject<IFileResponseDTO[]>({ data: files }));
  } catch (error) {
    handleControllerErrors({ error, res, defaultErrorMessage: "Could not retrieve files" });
  }
};

/**
 * @function uploadFile
 * save file metadata uploaded by multer to the database.
 *
 * @param {CustomRequest} req - The request object, containing the file(s) and user information.
 * @param {Response} res - The response object used to send back the HTTP response.
 * @param {NextFunction} next - The next function to call in the middleware chain.
 *
 * @returns A promise that resolves when the file is successfully uploaded and the response is sent.
 *
 * @throws {HttpError} If the file upload fails or if the user is not authenticated.
 */
export const uploadFile = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const files = req.files as Express.Multer.File[];
  const tags = req.body.tags;

  const userId = req.user?._id!;
  try {
    // check if files are present in the request
    if (!files || files.length === 0) {
      throw new HttpError({ message: "No file uploaded", statusCode: 400 });
    }

    // check if user id is present
    if (!req.user || !req.user?._id) {
      throw new HttpError({ message: "Unauthorized: User Authentication failed, Missing user id in the request", statusCode: 401 });
    }

    // create an array for storing file metadata
    let filesArray: IFileCreateDTO[] = [];

    // check if files is an array - multer should return an array of files
    if (Array.isArray(files)) {
      files.forEach((file) => {
        filesArray.push({
          originalName: file.originalname, // save the original file name
          filename: file.filename,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
          encoding: file.encoding,
          owner: userId,
          privacy: filePrivacyObject.PRIVATE,
          invitedUsers: [],
          blockedUsers: [],
          tags: tags,
        });
      });
    } else {
      // if files is not an array, throw 500 error, multer should return an array of files
      throw new HttpError({ message: "Invalid files format", details: "Expected an array of files, `req.files` must be array", statusCode: 500 });
    }
    const newFiles = await fileService.createFile(filesArray);

    // log the successful uploading of files in the specified log file for auditing
    logger.info(
      createLogObject({
        when: "uploadfile controller Controller",
        status: "Successful",
        action: "upload",
        userId,
        resource: "file",
      })
    );
    // Return file information
    res.status(200).json(
      createResponseObject<IFileResponseDTO>({
        message: "Files uploaded successfully",
        data: newFiles,
      })
    );
  } catch (error) {
    await removeFilesArrayFromUploads({ files });
    handleControllerErrors({ error, res, defaultErrorMessage: "uploading files failed", when: "uploadFile controller", resource: "file", action: "upload" });
  }
};

/**
 * Deletes a file based on the provided request parameters.
 *
 * @param req - The custom request object containing the file ID and user information.
 * @param res - The response object to send the result of the deletion operation.
 * @returns A promise that resolves to void.
 *
 * @throws {HttpError} If the file to be deleted is not found or if the deletion fails.
 */
export const deleteFile = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const fileId = req.params.id as unknown as Schema.Types.ObjectId;
    const userId = req.user?._id!;

    const existingFile = await fileService.getFileByOwnerAndId({ fileId, owner: userId });

    if (!existingFile) {
      throw new HttpError({ message: "File to be deleted not found", statusCode: 404 });
    }

    await removeFileFromUploads({ filename: existingFile.filename });

    const deletedFile = await fileService.deleteFile({ fileId, owner: userId });

    if (!deletedFile) throw new HttpError({ message: "File not found", statusCode: 404 });

    // Log the file removal success
    logger.info(
      createLogObject({
        resource: "file",
        status: "success",
        action: "delete",
        when: "deleteFile controller",
        userId,
        resourceId: fileId as unknown as string,
      })
    );

    res.status(200).json(createResponseObject<IFileResponseDTO>({ message: "File removed successfully", data: deletedFile }));
  } catch (error) {
    handleControllerErrors({ res, error, defaultErrorMessage: "Failed to delete file", when: "deleteFile controller", resource: "file", action: "delete" });
  }
};

/**
 * @function updateFile
 * to update a file.
 *
 * @param {CustomRequest} req - The request object, containing the file ID in the params and user information.
 * @param {Response} res - The response object used to send back the HTTP response.
 *
 * @throws {HttpError} If the file ID is invalid or the file is not found.
 * @throws {Error} If there is an error while blocking the user from accessing the file.
 */
export const updateFile = async (req: CustomRequest, res: Response) => {
  try {
    const fileId = req.params.id as unknown as Schema.Types.ObjectId;
    const userId = req.user?._id!;
    let updateData: IFileUpdateDTO = req.body;
    console.log({ updateData });

    const updatedFile = await fileService.updateFile({ fileId, userId, updateData });

    // Return file information
    res.status(200).json(createResponseObject<IFileResponseDTO>({ data: updatedFile }));
  } catch (error) {
    handleControllerErrors({ error, res, defaultErrorMessage: "Couldn't update File", when: "updateFile controller", resource: "file", action: "update" });
  }
};
