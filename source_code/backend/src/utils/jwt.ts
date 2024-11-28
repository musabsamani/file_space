import jwt, { TokenExpiredError } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { JWT_EXPIRATION } from "../constants";
import { HttpError } from "../errors/HttpError";
import { Request } from "express";

/**
 * Extracts a JWT token from the Authorization header of an Express request.
 *
 * @throws {HttpError} If the Authorization header is missing.
 * @throws {HttpError} If the JWT token is missing in the Authorization header.
 *
 * @param req - The Express request object.
 * @returns The extracted JWT token.
 */
export const extractTokenFromHeader = (req: Request): string => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) throw new HttpError({ message: "Authentication header is missing", statusCode: 401 });

  const token = authHeader.split(" ")[1];
  if (!token) throw new HttpError({ message: "Authentication token is missing", statusCode: 401 });

  return token;
};

/**
 * Verifies a JWT token using the secret key from environment variables.
 *
 * @param {string | null | undefined} token - The token to be verified.
 * @throws {HttpError} If the JWT_SECRET is not defined in the environment variables.
 * @throws {HttpError} If the token is null, undefined, or invalid.
 * @throws {HttpError} If the token has expired.
 */
export const verifyToken = (token: string | null | undefined) => {
  if (!JWT_SECRET) throw new HttpError({ message: "JWT_SECRET is not defined in the environment varibales", statusCode: 500 });
  if (!token) throw new HttpError({ message: "JWT_SECRET is not defined in the environment varibales", statusCode: 500 });
  try {
    jwt.verify(token, JWT_SECRET);
    return jwt.decode(token);
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new HttpError({ message: "Token expired", statusCode: 401 });
    }
    throw new HttpError({ message: "Invalid token", statusCode: 401 });
  }
};

/**
 * Generates a token given a payload.
 *
 * @param {any} payload - The payload to generate token from.
 * @returns {string} The generated token.
 * @throws {HttpError} If JWT_SECRET is not defined in the environment variables.
 * @throws {HttpError} If there is an error generating the token.
 */

export const generateToken = (payload: any): string | never => {
  if (!JWT_SECRET) throw new HttpError({ message: "JWT_SECRET is not defined in the environment varibales", statusCode: 500 });
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION.veryLong });
  } catch (err) {
    throw new HttpError({ message: "error generating token", statusCode: 401 });
  }
};
