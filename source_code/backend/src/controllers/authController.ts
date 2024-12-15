import { Response } from "express";
import { createResponseObject } from "../utils/createResponseObject";
import { IUserLogin } from "../interfaces/IUser";
import { handleControllerErrors } from "../utils/handleControllerErrors";
import { UserService } from "../services/userService";
import { generateToken } from "../utils/jwt";
import { customLogger } from "../utils/logger";
import { CustomRequest } from "../interfaces";
import { createLogObject } from "../utils/createLogObject";
import { logLevelObject } from "../config/enums";

const userService = new UserService();

/**
 * Handles user login.
 *
 * This function extracts user credentials from the request body, calls the
 * UserService to check if the user exists and if the password matches, and
 * sends a response containing the user data and a JWT token if the login is
 * successful.
 *
 * @param {Request} req - The request object containing user credentials for login.
 * @param {Response} res - The response object used to send back the result of the login.
 */
export const login = async (req: CustomRequest, res: Response) => {
  const { usernameOrEmail, password } = req.body as IUserLogin;
  try {
    // call the database service to check if the user exists and the password matches
    const user = await userService.login({ usernameOrEmail, password });

    // generate a JWT token for the user
    const token = generateToken({ _id: user._id, fullname: user.fullname, username: user.username, email: user.email, userRole: user.userRole });

    // log the successful login in the specified log file for auditing
    customLogger.audit(
      createLogObject({
        when: "login Controller",
        status: "Successful",
        action: "login",
        userId: user._id,
        resource: "user account",
      })
    );
    res
      .status(200)
      .setHeader("Authorization", `Bearer ${token}`)
      .json(createResponseObject({ data: { user: user } }));
  } catch (error) {
    // log the error in the specified log file for auditing
    customLogger.audit(
      createLogObject({
        when: "login Controller",
        status: "Successful",
        action: "login",
        usernameOrEmail,
        resource: "user account",
        error,
      })
    );
    // handle the error and send a response to the client
    // do not log the error since it has already been logged
    handleControllerErrors({ shouldLog: false, error, res, defaultErrorMessage: "user login failed" });
  }
};
