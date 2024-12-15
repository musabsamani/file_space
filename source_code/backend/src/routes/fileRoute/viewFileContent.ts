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

// route to get a file content by file ID
router.get(
  "/view/:id",
  [
    isValidIdParams,
    // Skip error handling for this route - we want to parse jwt token to get the user if logged in
    // for public file that do not need auth we and check by the next middleware if he is blocked or not
    jwtAuth({ action: "access", resource: "file", skipError: true }),
    // check if the file exist
    checkFileExist({ action: "read", resource: "file" }),
    // check if the user has permission to access the file
    checkPermission({ action: "access", resource: "file" }),
  ],
  file.viewFileById
);
export { router as viewFileContent };
