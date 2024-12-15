import bcrypt from "bcryptjs";
import { SALT_ROUNDS } from "../config/jwt";
import { HttpError } from "../errors/HttpError";

/**
 * @function getHashPassword
 * Hashes a given password using bcrypt.
 *
 * @param {Object} param - The parameter object.
 * @param {string} param.password - The password to be hashed.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 * @throws {HttpError} - Throws an error if hashing fails.
 */
export const getHashPassword = async ({ password }: { password: string }): Promise<string | never> => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new HttpError({ message: "Error hashing password", statusCode: 500 });
  }
};

/**
 * @function isPasswordMatch
 * checks if a plain text password matches a hashed password.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.plainPassword - The plain text password to compare.
 * @param {string} params.hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the passwords match.
 * @throws {HttpError} Throws an HttpError if there is an error during password comparison.
 */
export const isPasswordMatch = async ({ plainPassword, hashedPassword }: { plainPassword: string; hashedPassword: string }): Promise<boolean | never> => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    throw new HttpError({ message: "Error verifying password", statusCode: 500 });
  }
};
