import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { handleControllerErrors } from "../utils/handleControllerErrors";
import { createResponseObject } from "../utils/createResponseObject";
import { IUserCreateDTO, IUserResponseDTO, IUserUpdateDTO } from "../interfaces/IUser";
import { HttpError } from "../errors/HttpError";
import { logger } from "../utils/logger";
import { createLogObject } from "../utils/createLogObject";
import { CustomRequest } from "../interfaces";
import { logLevelObject } from "../config/enums";

// Instantiate the user service - this will be used to interact with the database
const userService = new UserService();

/**
 * @function getAllUsers
 * Retrieves all users in the database.
 *
 * @param {Request} req - Custom request object containing the user data.
 * @param {Response} res - The Express response object containing the list of users or error details.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const getAllUsers = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();

    // log the successful retrieval of users in the specified log file for auditing
    logger.info(
      createLogObject({
        when: "getAllUsers Controller",
        status: "Successful",
        action: "read",
        userId: req.user?._id,
        resource: "user",
      })
    );
    res.status(200).json(createResponseObject<IUserResponseDTO[]>({ data: users }));
  } catch (error) {
    handleControllerErrors({ res, error, defaultErrorMessage: "Failed to retrieve users", when: "getAllUsers controller", resource: "user", action: "read" });
  }
};

/**
 * Retrieves a user by their ID.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object containing the user or error details.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const getUserById = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;

    const user = await userService.getUserById({ userId });

    if (!user) throw new HttpError({ message: "User not found", statusCode: 404 });

    // log the successful retrieval of user in the specified log file for auditing
    logger.info(
      createLogObject({
        when: "getUserById Controller",
        status: "Successful",
        action: "read",
        userId: req?.user?._id,
        resource: "user",
      })
    );
    res.status(200).json(createResponseObject<IUserResponseDTO>({ data: user }));
  } catch (error) {
    handleControllerErrors({ res, error, defaultErrorMessage: "Failed to retrieve user", when: "getUserById controller", resource: "user", action: "read" });
  }
};

/**
 * @function createUser
 * Creates a new user in the database.

 * @param {Request} req - The Express request object containing the user data in the body.
 * @param {Response} res - The Express response object containing the created user or error details.
 * @returns {Promise<void>} A promise that resolves to void.
 *
 */
export const createUser = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const requestBody: IUserCreateDTO = req.body;
    const newUser = await userService.createUser(requestBody);

    // log the successful creation of a user in the specified log file for auditing
    logger.info(
      createLogObject({
        when: "createUser Controller",
        status: "Successful",
        action: "create",
        userId: req?.user?._id,
        resource: "user",
      })
    );
    res.status(201).json(createResponseObject<IUserResponseDTO>({ data: newUser }));
  } catch (error) {
    handleControllerErrors({ res, error, defaultErrorMessage: "Failed to create user", when: "createUser controller", resource: "user", action: "create" });
  }
};

/**
 * Updates an existing user in the database.
 * @async
 * @function updateUser
 * @param {Request} req - The Express request object containing user ID in the parameters and update data in the body.
 * @param {Response} res - The Express response object containing the updated user or error details.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const updateUser = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const updateData: IUserUpdateDTO = req.body;
    const updatedUser = await userService.updateUser({ userId, updateData });

    // log the successful updating of a user in the specified log file for auditing
    logger.info(
      createLogObject({
        when: "updateUser Controller",
        status: "Successful",
        action: "update",
        userId: req?.user?._id,
        resource: "user",
      })
    );
    res.status(200).json(createResponseObject<IUserResponseDTO>({ data: updatedUser }));
  } catch (error) {
    handleControllerErrors({ res, error, defaultErrorMessage: "Failed to update user", when: "updateUser controller", resource: "user", action: "update" });
  }
};

/**
 * Deletes a user from the database.
 *
 * @function deleteUser
 * @param {Request} req - The Express request object containing user ID in the parameters.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const deleteUser = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const deletedUser = await userService.deleteUser(id);

    // log the successful deletion of users in the specified log file for auditing
    logger.info(
      createLogObject({
        when: "deleteUser Controller",
        status: "Successful",
        action: "delete",
        userId: req?.user?._id,
        resource: "user",
      })
    );
    res.status(200).json(createResponseObject<IUserResponseDTO>({ data: deletedUser }));
  } catch (error) {
    handleControllerErrors({ res, error, defaultErrorMessage: "Failed to delete user", when: "deleteUser controller", resource: "user", action: "delete" });
  }
};

/**
 * Retrieves a user by their ID.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object containing the user or error details.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const isValidUsernameOrEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const usernameOrEmailList = req.body.usernameOrEmailList as string[];

    if (!(usernameOrEmailList?.length > 0)) {
      throw new HttpError({ message: "Empty Body, there is no users to check", statusCode: 400 });
    }
    const users = await userService.isValidUsernameOrEmail({ usernameOrEmailList });

    // log the successful validation of username or email in the specified log file for auditing
    logger.info(
      createLogObject({
        when: "isValidUsernameOrEmail Controller",
        status: "Successful",
        action: "read",
        resource: "user",
      })
    );
    res.status(200).json(createResponseObject<typeof users>({ data: users }));
  } catch (error) {
    // no need to log this error as it is a validation error
    // so pass logLevel as NULL
    handleControllerErrors({ shouldLog: false, res, error, defaultErrorMessage: "Failed to validate username or email list" });
  }
};
