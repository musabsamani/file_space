import { Router } from "express";
import * as file from "../../controllers/fileController";
import { jwtAuth } from "../../middlewares/jwtAuth";
import { isValidIdParams } from "../../middlewares/isValidIdParams";
import { validateRequestBody } from "../../middlewares/validateRequestBody";
import { fileUpload } from "../../validations/fileValidationSchema";
import { upload } from "../../middlewares/multer";
import { checkPermission } from "../../middlewares/checkPermission";
import { checkFileExist } from "../../middlewares/checkFileExist";

const router = Router();

// Route to get all files belonging to a user (logged in user)
router.get("/", jwtAuth({ action: "read", resource: "file" }), file.getLoggedInUserFiles);

// Route to get a files by its id
// authentication middleware is used to get user id from the token
// for checking if the user has permission to access the file
// if the user is not authenticated, the file will be returned only if it is public
// and if file is `restricted` only authenticated user can access it except blocked users - not public
router.get(
  "/:id",
  [
    // check if the id is valid
    isValidIdParams,
    // Skip error handling for this route - we want to parse jwt token to get the user if logged in
    // for public file that do not need auth we and check by the next middleware if he is blocked or not
    jwtAuth({ action: "read", resource: "file", skipError: true }),
    // check if the file exists
    checkFileExist({ action: "read", resource: "file" }),
    // check if the user has permission to access the file
    checkPermission({ action: "read", resource: "file" }),
  ],
  file.getFileById
);

// Route to upload a new files
// only authenticated users can upload files (logged in users)
router.post(
  "/",
  [
    // check if the id is valid
    jwtAuth({ action: "create", resource: "file" }),
    // validate the request body
    validateRequestBody(fileUpload, false),
    // only the authenticated user can create the file
    upload.array("files"),
  ],
  file.uploadFile
);

// Route to delete a files
// users can delete only delete their own files
router.delete(
  "/:id",
  [
    // check if the id is valid
    isValidIdParams,
    // only the authenticated user can delete a file
    jwtAuth({ action: "delete", resource: "file" }),
    // check if the file exists
    checkFileExist({ action: "delete", resource: "file" }),
    // check if the user has permission to access the file
    checkPermission({ action: "read", resource: "file", shouldBeOwner: true }),
  ],
  file.deleteFile
);

export { router as userFiles };
