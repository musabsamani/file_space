import Joi from "joi";

type InstructionTypes = "reload" | "logout" | "login";

interface IErrorResponse {
  message: string;
  details?: string | string[] | Joi.ValidationErrorItem;
  instructions?: InstructionTypes;
}

interface IcreateResponseObject<T> {
  data?: T | T[] | null;
  error?: IErrorResponse | null;
}
export const createResponseObject = <T>({ data, error }: IcreateResponseObject<T>): IcreateResponseObject<T> => {
  return { data, error };
};
