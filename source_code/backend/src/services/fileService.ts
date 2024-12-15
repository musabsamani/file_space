import { configDotenv } from "dotenv";
import { FileModel } from "../models/fileModel";
import { HttpError } from "../errors/HttpError";
import { handleDatabaseErrors } from "../utils/handleDatabaseErrors";
import { IFileCreateDTO, IFileResponseDTO, IFileUpdateDTO } from "../interfaces/IFile";
import { Schema, Types } from "mongoose";
import { UserModel } from "../models/userModel";
import { filePrivacyObject } from "../config/enums";

configDotenv();

/**
 * Interface representing a file share.
 *
 * @interface IFileShare
 *
 * @property {Schema.Types.ObjectId} fileId - The unique identifier of the file.
 * @property {Schema.Types.ObjectId} userId - The unique identifier of the user who owns the file.
 * @property {Schema.Types.ObjectId[]} owner - An array of user IDs who are owner of the file.
 * @property {Schema.Types.ObjectId[]} invitedUsers - An array of user IDs with whom the file is shared.
 * @property {Schema.Types.ObjectId[]} blockedUsers - An array of user IDs who are blocked from accessing the file.
 * @property {boolean} isPublic - A flag indicating whether the file is public or not.
 */
interface IFileShare {
  fileId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  owner: Schema.Types.ObjectId[];
  invitedUsers: Schema.Types.ObjectId[];
  blockedUsers: Schema.Types.ObjectId[];
  isPublic: boolean;
}

/**
 * @class FileService
 * FileService class to handle file-related operations such as retrieval, removal, and management of File data.
 *
 * The class provides the following methods:
 * @method `getFileByOwnerAndId`: retrieves a File by its ID and owner.
 * @method `getFilesByOwnerId`: retrieves all Files owned by a specific user.
 * @method `getFileById`: retrieves a File by its ID.
 * @method `createFile`: creates a new File with the provided data.
 * @method `updateFile`: updates an existing File with the provided data.
 * @method `deleteFile`: deletes a File by its ID and owner.
 */

export class FileService {
  /**
   * Retrieves a file by its ID and owner.
   * @param {Object} params - The parameters object.
   * @param {Schema.Types.ObjectId} params.fileId - The unique identifier of the file.
   * @param {Schema.Types.ObjectId | Schema.Types.ObjectId[]} params.owner - The owner of the file.
   * @returns {Promise<IFileResponseDTO | null | never>} A promise that resolves to the file if found, or null if not found.
   * @throws Throws an `HttpError` if a database error occurs during retrieval.
   */
  public async getFileByOwnerAndId({ fileId, owner }: { fileId: Schema.Types.ObjectId; owner: Schema.Types.ObjectId | Schema.Types.ObjectId[] }): Promise<IFileResponseDTO | null | never> {
    try {
      const file = await FileModel.findOne({ _id: fileId, owner });
      return file;
    } catch (error) {
      return handleDatabaseErrors({ error, defaultErrorMessage: "File retrieval failed" });
    }
  }

  /**
   * Retrieves all files owned by a specific user.
   * @param {Object} params - The parameters object.
   * @param {Schema.Types.ObjectId} params.userId - The unique identifier of the user.
   * @returns {Promise<IFileResponseDTO[] | null>} A promise that resolves to an array of files if found, or null if not found.
   * @throws Throws an `HttpError` if a database error occurs during retrieval.
   */
  public async getFilesByOwnerId({ userId }: { userId: Schema.Types.ObjectId }): Promise<IFileResponseDTO[] | null> {
    try {
      const files = await FileModel.find({ owner: userId });
      return files;
    } catch (error) {
      return handleDatabaseErrors({ error, defaultErrorMessage: "Couldn't retrieve user's files" });
    }
  }

  /**
   * Retrieves a file by its ID.
   * @param {Object} params - The parameters object.
   * @param {Schema.Types.ObjectId} params.fileId - The unique identifier of the file.
   * @returns {Promise<IFileResponseDTO | null>} A promise that resolves to the file if found, or null if not found.
   * @throws Throws an `HttpError` if a database error occurs during retrieval.
   */
  public async getFileById({ fileId }: { fileId: Schema.Types.ObjectId }): Promise<IFileResponseDTO | null> {
    try {
      const file = await FileModel.findById(fileId);
      if (!file) {
        throw new HttpError({ message: "File not found", details: `No file found with ID ${fileId}`, statusCode: 404 });
      }
      return file;
    } catch (error) {
      return handleDatabaseErrors({ error, defaultErrorMessage: "Couldn't retrieve a file by ID" });
    }
  }

  /**
   * Creates a new file with the provided data.
   * @param {IFileCreateDTO | IFileCreateDTO[]} metadata - The data to create the file(s).
   * @returns {Promise<IFileResponseDTO | IFileResponseDTO[] | never>} A promise that resolves to the created file(s).
   * @throws Throws an `HttpError` if a database error occurs during creation.
   */
  public async createFile(metadata: IFileCreateDTO | IFileCreateDTO[]): Promise<IFileResponseDTO | IFileResponseDTO[] | never> {
    try {
      const newFile = await FileModel.create(metadata);
      return newFile;
    } catch (error) {
      return handleDatabaseErrors({ error, defaultErrorMessage: "File creation failed" });
    }
  }

  /**
   * Updates an existing file with the provided data.
   *
   * for invitedUsers and blockedUsers update, we check if the user IDs in the array are valid
   * then we update the whole corresponding field (`invitedUsers` or `blockedUsers`) array in the database with the new array
   *
   * for other fields tags and privacy we update the whole field in the database with the new value
   *
   * @remarks privacy value are checked in the validation middleware before reaching this function
   * @remarks we don't update the file content in this function, we only update the metadata
   *
   * @param {Object} params - The parameters object.
   * @param {string} params.FileId - The unique identifier of the file to update.
   * @param {IFileUpdateDTO} params.updateData - The data to update the file with.
   * @returns {Promise<IFileResponseDTO | never>} A promise that resolves to the updated file.
   * @throws Throws an `HttpError` if a database error occurs during update.
   */
  public async updateFile({ fileId, userId, updateData }: { fileId: Schema.Types.ObjectId; userId: Schema.Types.ObjectId; updateData: IFileUpdateDTO }): Promise<IFileResponseDTO | never> {
    try {
      // Check if the file exists
      const existing = await FileModel.findById(fileId);
      if (!existing) {
        throw new HttpError({ message: "File to update not found", details: `No file found with ID ${fileId}`, statusCode: 404 });
      }

      // Check if the file has been modified and the current updatedAt value is different from the one in the database
      if (new Date(existing.updatedAt!).getTime() !== new Date(updateData.updatedAt).getTime()) {
        throw new HttpError({ message: "File has been modified, get the updated one first", details: "The file has been modified since it was last retrieved", statusCode: 409 });
      }

      // check if the user IDs in the blockedUsers are valid
      if (updateData.blockedUsers) {
        const usersExist = await UserModel.find({ _id: { $in: updateData.blockedUsers } });
        if (usersExist.length !== updateData.blockedUsers.length) {
          throw new HttpError({ message: "Invalid user IDs", details: "One or more user IDs in the blockedUsers array  not exist", statusCode: 400 });
        }

        // check if the user is blocked himself from the file
        // throw an error if the user is trying to block himself
        if (updateData.blockedUsers?.includes(userId)) {
          throw new HttpError({ message: "Invalid user ID: You can't block yourself from the file", statusCode: 400 });
        }
      }
      // check if the user IDs in the invitedUsers are valid
      if (updateData.invitedUsers) {
        const usersExist = await UserModel.find({ _id: { $in: updateData.invitedUsers } });
        if (usersExist.length !== updateData.invitedUsers.length) {
          throw new HttpError({ message: "Invalid user IDs", details: "One or more user IDs in the blockedUsers array  not exist", statusCode: 400 });
        }
        // check if the user is invited himself to the file
        // remove the user from the invitedUsers array - since he is the owner
        if (updateData.invitedUsers?.includes(userId)) updateData.invitedUsers = updateData.invitedUsers.filter((id) => id !== userId);
      } else if (updateData.privacy) {
        // check if the privacy value is valid
        // double check after the validation middleware
        if (!Object.values(filePrivacyObject).includes(updateData.privacy)) {
          throw new HttpError({ message: "Invalid privacy value", details: `The privacy value must be one of values ${Object.values(filePrivacyObject)}`, statusCode: 400 });
        }
      }

      const updatedFile = (await FileModel.findByIdAndUpdate(fileId, updateData, { new: true })) as IFileResponseDTO;

      return updatedFile;
    } catch (error) {
      return handleDatabaseErrors({ error, defaultErrorMessage: "File update failed" });
    }
  }

  /**
   * Deletes a file by its ID and owner.
   * @param {Object} params - The parameters object.
   * @param {Schema.Types.ObjectId} params.fileId - The unique identifier of the file to delete.
   * @param {Schema.Types.ObjectId | Schema.Types.ObjectId[]} params.owner - The owner of the file.
   * @returns {Promise<IFileResponseDTO | null | never>} A promise that resolves to the deleted file if found, or null if not found.
   * @throws Throws an `HttpError` if a database error occurs during deletion.
   */
  public async deleteFile({ fileId, owner }: { fileId: Schema.Types.ObjectId; owner: Schema.Types.ObjectId | Schema.Types.ObjectId[] }): Promise<IFileResponseDTO | null | never> {
    try {
      const deletedFile = await FileModel.findOneAndDelete({ _id: fileId, owner });
      if (!deletedFile) {
        throw new HttpError({ message: "File to delete not found", details: `No file found with ID ${fileId} and owner ${owner}`, statusCode: 404 });
      }
      return deletedFile;
    } catch (error) {
      return handleDatabaseErrors({ error, defaultErrorMessage: "File deletion failed" });
    }
  }
}
