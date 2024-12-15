import { Request } from "express";
import { AuthActions, filePrivacyObject, logLevelObject, userRoleObject } from "../config/enums";
import { IUserToken } from "./IUser";

/**
 * Custom request interface that extends the Express Request interface.
 * This interface is used to type-check the request object in routes and middleware.
 * It adds the user property which contains the user data from the database.
 */
export interface CustomRequest extends Request {
  user?: IUserToken;
  // Files uploaded via multipart/form-data
  files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
}

/**
 * Type for the log levels.
 * @enum {string}
 */
//d
export type LogLevelType = (typeof logLevelObject)[keyof typeof logLevelObject];

/**
 * @type FilePrivacyType
 * Type for file privacy levels.
 *
 * @property {string} public - Indicates that the file is publicly accessible - no sign-in required.
 * @property {string} restricted - Indicates that the file is accessible only to authenticated users except those who are blocked.
 * @property {string} private - Indicates that the file is privately accessible.
 * @enum {string}
 */
export type FilePrivacyType = (typeof filePrivacyObject)[keyof typeof filePrivacyObject];

/**
 * type for user roles.
 * Admin role, has full access to all routes and features.
 * User role, has access to public shared files + his own files only.
 * Guest role, has limited access to public shared files only.
 */
export type UserRoleType = (typeof userRoleObject)[keyof typeof userRoleObject];

/**
 * @interface ActionType
 *
 * Represents the types of actions and resources that can be used in the authentication and authorization process.
 *
 * @property {string} action - The action to be performed, which can be one of the predefined actions in AuthActions.
 * @property {string} resource - The resource on which the action is to be performed, which can be one of the predefined resources in AuthActions.
 */
export interface ActionType {
  action: (typeof AuthActions.action)[keyof typeof AuthActions.action];
  resource: (typeof AuthActions.resource)[keyof typeof AuthActions.resource];
}
