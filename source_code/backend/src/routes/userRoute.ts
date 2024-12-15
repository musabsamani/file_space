import { Router } from "express";
import * as user from "../controllers/userController";
import { jwtAuth } from "../middlewares/jwtAuth";
import { isValidIdParams } from "../middlewares/isValidIdParams";
import { validateRequestBody } from "../middlewares/validateRequestBody";
import { isReqParamIdMatch } from "../middlewares/isReqParamIdMatch";
import { isValidUsernameOrEmailList, userCreate, userUpdate } from "../validations/userValidationSchema";
import { checkUserRole } from "../middlewares/checkUserRole";
import { userRoleObject } from "../config/enums";
export const router = Router();

// Route to get all users in the database - only accessible to admin users
router.get("/", [jwtAuth({ action: "read", resource: "user" }), checkUserRole({ allowedRoles: [userRoleObject.ADMIN], action: "read", resource: "user" })], user.getAllUsers);

// Route to get a user by ID with ID validation
router.get("/:id", [jwtAuth({ action: "read", resource: "user" }), checkUserRole({ action: "read", resource: "user" }), isValidIdParams], user.getUserById);

// Route to create a new user
router.post("/", [jwtAuth({ action: "create", resource: "user" }), checkUserRole({ action: "create", resource: "user" }), validateRequestBody(userCreate)], user.createUser);

// Route to update a user by ID with ID validation
router.put(
  "/:id",
  [isValidIdParams, isReqParamIdMatch, jwtAuth({ action: "update", resource: "user" }), checkUserRole({ action: "update", resource: "user" }), validateRequestBody(userUpdate)],
  user.updateUser
);

// Route to delete a user by ID with ID validation
router.delete("/:id", [isValidIdParams, jwtAuth({ action: "delete", resource: "user" }), checkUserRole({ action: "delete", resource: "user" })], user.deleteUser);

// Route to check if a username or email is valid or not
router.post("/is-valid-user", jwtAuth({ action: "read", resource: "user" }), validateRequestBody(isValidUsernameOrEmailList), user.isValidUsernameOrEmail);
