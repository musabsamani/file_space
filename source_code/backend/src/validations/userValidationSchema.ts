import Joi from "joi";
import { makeJoiRequiredFieldOptional } from "../utils/makeJoiRequiredFieldOptional";
import { joiObjectId } from "./fileValidationSchema";

/** Generic user validation schema using as basic validation for other validating user schemas */
const userRequiredFields = {
  fullname: Joi.string().required(),
  username: Joi.string()
    .pattern(/^[^@]*$/, { name: "no-at-symbol" })
    .messages({
      "string.pattern.name": "Username must not contain the '@' symbol",
    })
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
};

/**
 * Joi schema that validates either an email or a username.
 * it is used by other schemas to validate either an email or a username. e.g. login schema
 * This object defines a validation schema for a field that can be either a username or an email.
 */
const usernameOrEmailObject = {
  usernameOrEmail: Joi.alternatives().try(userRequiredFields.email, userRequiredFields.username).required().label("username or email"),
};

/**
 * Validation schema for user creation.
 *
 * it the same as `userRequiredFields` schema
 *
 * @extends userRequiredFields schema
 */
export const userCreate = Joi.object({
  ...userRequiredFields,
});

/**
 * Creates optional fields for updating a user by making the required fields optional.
 */
const userOptionalFieldsForUpdate = makeJoiRequiredFieldOptional<typeof userRequiredFields>(userRequiredFields);

/**
 * Validation schema for user update.
 *
 * @property {string} _id - The unique identifier of the user. Required.
 * @property {Date} updatedAt - The date when the user was last updated. Required.
 * @extends {userRequiredFields} schema
 */
export const userUpdate = Joi.object({
  ...userOptionalFieldsForUpdate,
  // make sure the id is a valid ObjectId
  _id: joiObjectId,
  updatedAt: Joi.date().required(),
});

/**
 * Validation schema for user login.
 *
 * @property {string} usernameOrEmail - The username or email of the user. Required.
 * @property {string} password - The password of the user. Required.
 * @extends {userRequiredFields} schema
 */
export const userLogin = Joi.object({
  usernameOrEmail: usernameOrEmailObject.usernameOrEmail,
  password: userRequiredFields.password,
});

/**
 * Validation schema for a list of usernames or emails.
 *
 * This schema validates that the input is an array of strings, where each string
 * is either a username or an email.
 */
export const isValidUsernameOrEmailList = Joi.object({
  usernameOrEmailList: Joi.array().items(usernameOrEmailObject.usernameOrEmail).messages({ "any.required": "you should provide a list of username or email" }).label("username Or Email list"),
});
