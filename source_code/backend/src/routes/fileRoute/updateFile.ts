import { Router } from "express";
import * as file from "../../controllers/fileController";
import { jwtAuth } from "../../middlewares/jwtAuth";
import { isValidIdParams } from "../../middlewares/isValidIdParams";
import { checkPermission } from "../../middlewares/checkPermission";
import { validateRequestBody } from "../../middlewares/validateRequestBody";
import { setFilePrivacy, setInvitedUsers, setBlockedUsers } from "../../validations/fileValidationSchema";
import { checkFileExist } from "../../middlewares/checkFileExist";

const router = Router();

// Route to update the tags of a file
router.put(
  "/set-tags/:id",
  [
    // check if the id is valid
    isValidIdParams,
    // validate the request body for tags
    validateRequestBody(setFilePrivacy),
    // check if the user is authenticated
    jwtAuth({ action: "update", resource: "file" }),
    // check if the file exists
    checkFileExist({ action: "update", resource: "file" }),
    // check if the user is the owner of the file
    checkPermission({ action: "update", resource: "file", shouldBeOwner: true }),
  ],
  file.updateFile
);

// Route to update the privacy level of a file
router.put(
  "/set-privacy/:id",
  [
    // check if the id is valid
    isValidIdParams,
    // validate the request body for privacy
    validateRequestBody(setFilePrivacy),
    // check if the user is authenticated
    jwtAuth({ action: "update", resource: "file" }),
    // check if the file exists
    checkFileExist({ action: "update", resource: "file" }),
    // check if the user is the owner of the file
    checkPermission({ action: "update", resource: "file", shouldBeOwner: true }),
  ],
  file.updateFile
);

// Route to update the invitedUsers list of a file
router.put(
  "/set-invited-users/:id",
  [
    // check if the id is valid
    isValidIdParams,
    // validate the request body for invitedUsers
    validateRequestBody(setInvitedUsers),
    // check if the user is authenticated
    jwtAuth({ action: "update", resource: "file" }),
    // check if the file exists
    checkFileExist({ action: "update", resource: "file" }),
    // check if the user is the owner of the file
    checkPermission({ action: "update", resource: "file", shouldBeOwner: true }),
  ],
  file.updateFile
);

// Route to update the blockedUsers list of a file
router.put(
  "/set-blocked-users/:id",
  [
    // check if the id is valid
    isValidIdParams,
    // validate the request body for blocked users
    validateRequestBody(setBlockedUsers),
    // check if the user is authenticated
    jwtAuth({ action: "update", resource: "file" }),
    // check if the file exists
    checkFileExist({ action: "update", resource: "file" }),
    // check if the user is the owner of the file
    checkPermission({ action: "update", resource: "file", shouldBeOwner: true }),
  ],
  file.updateFile
);

export { router as updateFile };
