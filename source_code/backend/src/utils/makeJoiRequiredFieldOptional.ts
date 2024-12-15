import Joi from "joi";

/**
 * Transforms all required fields in a Joi schema object to optional fields.
 *
 * @template T - The type of the object.
 * @param {Record<keyof T, Joi.Schema>} object - The Joi schema object with required fields.
 * @returns {Record<keyof T, Joi.Schema>} A new Joi schema object with all fields set to optional.
 */
export const makeJoiRequiredFieldOptional = <T>(object: Record<keyof T, Joi.Schema>) => {
  return Object.keys(object).reduce((acc, key) => {
    acc[key as keyof typeof object] = object[key as keyof typeof object].optional();
    return acc;
  }, {} as Record<keyof T, Joi.Schema>);
};
