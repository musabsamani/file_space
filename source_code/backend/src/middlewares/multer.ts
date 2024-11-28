import multer, { MulterError, FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { UPLOAD_FOLDER } from "../constants";

/**
 * Multer storage configuration
 * Handles file storage with a custom destination and filename
 */
const storage = multer.diskStorage({
  // Set the destination directory for uploaded files
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, UPLOAD_FOLDER); // Save files to the defined uploads folder
  },

  // Set a unique filename for the uploaded file
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const fileExtension = path.extname(file.originalname); // Extract file extension
    const uniqueFilename = `${uuidv4()}${fileExtension}`; // Generate unique filename
    cb(null, uniqueFilename);
  },
});

/**
 * File filter function to validate file types
 * Allows only specific file types based on extension and MIME type
 */
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  // Define allowed file types (both extension and MIME type)
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mkv|webm|mov|flv|wmv|avi/;

  // Validate file extension and MIME type
  const isExtensionValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isMimeTypeValid = allowedTypes.test(file.mimetype);

  if (isExtensionValid && isMimeTypeValid) {
    cb(null, true); // Accept the file
  } else {
    cb(new MulterError("LIMIT_UNEXPECTED_FILE")); // Reject the file
  }
};

/**
 * Multer instance configuration
 * Includes storage, file size limits, and file filter
 */
const upload = multer({
  storage, // Use custom storage configuration
  limits: { fileSize: 100 * 1024 * 1024 }, // Set maximum file size (100 MB)
  fileFilter, // Use custom file filter for validation
});

export { upload };
