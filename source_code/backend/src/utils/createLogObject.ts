import { Schema } from "mongoose";
import { HttpError } from "../errors/HttpError";
import { logLevelObject } from "../config/enums";

/**
 * @interface ILogObject
 * Interface representing the parameters for the createLogObject function.
 *
 * @property {string} [level] - The log level (e.g., "info", "error").
 * @property {string} status - The status of the action (e.g., "Granted Access", "Rejected Access").
 * @property {string} action - The action being performed (e.g., "read", "write").
 * @property {string} resource - The resource being accessed (e.g., "file").
 * @property {string} [when] - The time or context when the action occurred.
 * @property {Schema.Types.ObjectId} [userId] - The ID of the user performing the action.
 * @property {string} [usernameOrEmail] - The username or email of the user performing the action.
 * @property {any} [error] - The error object, if any.
 */
interface ILogObject {
  level?: string;
  status: string;
  action: string;
  resource: string;
  when?: string;
  userId?: Schema.Types.ObjectId;
  resourceId?: string;
  usernameOrEmail?: string;
  error?: any;
}

/**
 * @function createLogObject
 *  is used to unify the log format
 *
 * Creates a log object and returns it as a JSON string.
 *
 * @param {ILogObject} params - The parameters for creating the log object.
 * @param {string} [params.level=logLevelObject.INFO] - The log level (e.g., "info", "error").
 * @param {string} params.status - The status of the action (e.g., "Granted Access", "Rejected Access").
 * @param {string} params.action - The action being performed (e.g., "read", "write").
 * @param {string} params.resource - The resource being accessed (e.g., "file").
 * @param {string} params.resourceId - The resource unique identifier or name.
 * @param {string} [params.when] - The time or context when the action occurred.
 * @param {Schema.Types.ObjectId} [params.userId] - The ID of the user performing the action.
 * @param {string} [params.usernameOrEmail] - The username or email of the user performing the action.
 * @param {any} [params.error] - The error object, if any.
 * @returns {string} The log object as a JSON string.
 */
export const createLogObject = ({ level = logLevelObject.INFO, when, resourceId, status, action, usernameOrEmail, resource, userId, error }: ILogObject): string => {
  const err = error as HttpError;
  const errorMessage = {
    message: err?.message,
    details: err?.details,
    stack: err?.stack,
    statusCode: err?.statusCode,
  };
  const log = {
    level,
    status,
    action,
    when,
    resource,
    userId,
    resourceId,
    usernameOrEmail,
    errorMessage,
  };
  return JSON.stringify(log, null, 4);
};
