import { join } from "path";
import { promises as fs } from "fs";
import { HttpError } from "../errors/HttpError";
import { uploadDir } from "../config/server";

/**
 * Removes a file from the uploads directory.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.filename - The name of the file to remove.
 * @returns {Promise<void>} A promise that resolves when the file is removed.
 * @throws {HttpError} If the file removal fails.
 */
export const removeFileFromUploads = async ({ filename }: { filename: string }): Promise<void> => {
  try {
    const fullPath = join(uploadDir, filename);
    await fs.unlink(fullPath);
  } catch (err) {
    // Log the file removal failure
    throw new HttpError({ message: `Failed to remove file ${filename} from ${uploadDir}`, statusCode: 500 });
  }
};

/**
 * Removes an array of files from the uploads directory.
 *
 * @param {Object} params - The parameters object.
 * @param {Express.Multer.File[]} params.files - The array of files to remove.
 * @returns {Promise<void>} A promise that resolves when all files are removed.
 * @throws {HttpError} If any file removal fails.
 */
export const removeFilesArrayFromUploads = async ({ files }: { files: Express.Multer.File[] }): Promise<void> => {
  try {
    // if there are no files, do nothing
    if (!files || files.length === 0) return;
    // loop through the files and remove each one
    for (const file of files) {
      await removeFileFromUploads({ filename: file.filename });
    }
  } catch (err) {
    throw new HttpError({ message: "Failed to remove files from /uploads", statusCode: 500 });
  }
};
