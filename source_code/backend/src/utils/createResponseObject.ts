import Joi from "joi";
import { ResponseInstructionTypes, ResponseStatusType } from "../config/response";

/**
 * Interface representing an error response object.
 *
 * This interface is used to define the structure of error responses
 * that can be returned by the application. It includes a message,
 * optional details, and instructions for handling the error.
 */
interface IErrorResponse {
  message: string;
  details?: string | string[] | Joi.ValidationErrorItem;
  instructions?: ResponseInstructionTypes;
}

/**
 * Interface representing the structure of a response object.
 *
 * @template T - The type of the data to be included in the response if it is successful.
 * @property {string} [message] - Optional message for the response.
 * @property {ResponseStatusType} [status] - Optional status of the response.
 * @property {T | T[] | null} [data] - Optional data payload of the response.
 * @property {IErrorResponse | null} [error] - Optional error information.
 */
interface IcreateResponseObject<T> {
  message?: string;
  status?: ResponseStatusType;
  data?: T | T[] | null;
  error?: IErrorResponse | null;
}

/**
 * @function createResponseObject
 * is used to unify the response format
 *
 * Creates a response object with the specified data and error information.
 *
 * This utility function is used to construct a structured response object
 * that can be returned by the application. It includes optional data and
 * error details to provide a standardized response format.
 *
 * @template T - The type of the data to be included in the response if it is successful.
 * @param {IcreateResponseObject<T>} params - An object containing data and error information.
 * @param {T | T[] | null} [params.data] - Optional data payload of the response.
 * @param {IErrorResponse | null} [params.error] - Optional error information if there is an error.
 * @returns {IcreateResponseObject<T>} - The constructed response object.
 */
export const createResponseObject = <T>({ message, status, data, error }: IcreateResponseObject<T>): IcreateResponseObject<T> => {
  return { message, status, data, error };
};
