import { Router } from "express";
import { updateFile } from "./updateFile";
import { userFiles } from "./userFilesRoutes";
import { viewFileContent } from "./viewFileContent";

export const router = Router();

// Routes to update file
// Includes routes for setting file privacy, inviting users, and blocking users and updating file tags
router.use(updateFile);

// route to get a file content by file ID for public files or any file that the user has access to depending on the privacy settings
router.use(viewFileContent);

// Routes to handle file operations for logged-in users and publicly accessible files
// Includes routes for uploading, deleting, and retrieving user-specific files
// It used for access the file metadata and the actual file data
router.use(userFiles);
