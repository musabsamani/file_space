import multer, { MulterError, FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { MAX_FILE_SIZE, multerAllowedMimeTypes, uploadDir } from "../config/server";
import { handleControllerErrors } from "../utils/handleControllerErrors";
import { Http } from "winston/lib/winston/transports";
import { HttpError } from "../errors/HttpError";
import { logger } from "../utils/logger";
import { createLogObject } from "../utils/createLogObject";

/**
 * Multer storage configuration
 * Handles file storage with a custom destination and filename
 */
const storage = multer.diskStorage({
  // Set the destination directory for uploaded files
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir); // Save files to the defined uploads folder
  },

  // Set a unique filename for the uploaded file
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // const fileExtension = path.extname(file.originalname); // Extract file extension
    const uniqueFilename = uuidv4(); // Generate unique filename
    cb(null, uniqueFilename);
  },
});

/**
 * File filter function to validate file types
 * Allows only specific file types based on extension and MIME type
 */
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  // Check if the file type is allowed
  if (multerAllowedMimeTypes.includes(file.mimetype)) {
    // if the file type is allowed, accept it and log the success
    logger.info(
      createLogObject({
        when: "multer upload middleware - file filter",
        status: "success",
        action: "upload",
        resource: "file",
        resourceId: file.filename,
      })
    );
    // Accept the file and continue processing
    cb(null, true);
  } else {
    // if the file is rejected, and log the failure
    logger.info(
      createLogObject({
        when: "multer upload middleware - file filter",
        status: "fail",
        action: "upload",
        resource: "file",
        resourceId: file.filename,
      })
    );
    // Reject the file and throw an error to be handled by the error handler middleware
    cb(new HttpError({ message: "File type not allowed", details: `file with original name '${file.originalname}' upload failed`, statusCode: 400 }));
  }
};

/**
 * Multer instance configuration
 * Includes storage, file size limits, and file filter
 */
export const upload = multer({
  storage, // Use custom storage configuration
  limits: { fileSize: MAX_FILE_SIZE }, // Set maximum file size
  fileFilter, // Use custom file filter for validation
});
