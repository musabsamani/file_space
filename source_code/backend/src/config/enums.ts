/**
 * Object representing the different log levels.
 *
 * null - No logging.
 *
 * log - Standard log level.
 *
 * info - Information log level.
 *
 * warn - Warning log level.
 *
 * error - Error log level.
 */
export const logLevelObject = {
  NULL: "null",
  LOG: "log",
  INFO: "info",
  WARN: "warn",
  Error: "error",
  audit: "audit",
} as const;

/**
 * This module defines the actions and resources related to authentication and authorization.
 *
 * @property {ActionType} action - The available actions for authentication.
 * @property {ResourceTypes} resource - The available resources for authentication.
 *
 * @property {string} access - Represents the action to access a resource.
 * @property {string} read - Represents the action to read a resource.
 * @property {string} create - Represents the action to create a resource.
 * @property {string} update - Represents the action to update a resource.
 * @property {string} delete - Represents the action to delete a resource.
 *
 * @property {string} user - Represents the user resource.
 * @property {string} file - Represents the file resource.
 */
export const AuthActions = {
  action: {
    access: "access",
    read: "read",
    share: "set-privacy",
    create: "create",
    update: "update",
    delete: "delete",
  },
  resource: {
    user: "user",
    file: "file",
  },
} as const;

/**
 * Object that represents the possible roles of a user
 * @enum {string}
 * @readonly
 * @property {string} Admin - The admin role, has full access to all routes and features.
 * @property {string} User - The user role, has access to public shared files + his own files only.
 * @property {string} Guest - The guest role, has limited access to public shared files only.
 */
export const userRoleObject = {
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest",
} as const;

/**
 * An object representing different levels of file privacy.
 *
 * @property {string} public - Indicates that the file is publicly accessible - no sign-in required.
 * @property {string} restricted - Indicates that the file is accessible only to authenticated users except those who are blocked.
 * @property {string} private - Indicates that the file is privately accessible.
 */
export const filePrivacyObject = {
  PUBLIC: "public",
  RESTRICTED: "restricted",
  PRIVATE: "private",
} as const;
