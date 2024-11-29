import Joi from "joi";

// global user schema and for dynamic
/**
 * User validation schema using Joi
 * @property {string} fullname - The fullname of the user, required
 * @property {string} username - The username of the user, required and must not contain '@'
 * @property {string} email - The email of the user, required and must be a valid email format
 * @property {string} password - The password of the user, required and must be at least 8 characters long
 */
const user = {
  fullname: Joi.string().required(),
  username: Joi.string()
    .pattern(/^[^@]*$/) // prohibit @ symbol as a part of username
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
};

/**
 * Validation schema for user registration
 * @property {string} fullname - The fullname of the user
 * @property {string} username - The username of the user
 * @property {string} email - The email of the user
 * @property {string} password - The password of the user
 */
export const userRegistration = Joi.object({
  ...user,
});

/**
 * Validation schema for user login
 * @property {string} usernameOrEmail - The username or email of the user
 * @property {string} password - The password of the user
 */
export const userlogin = Joi.object({
  usernameOrEmail: Joi.alternatives().try(user.email, user.username).required().label("username or email"),
  password: Joi.string(),
});
