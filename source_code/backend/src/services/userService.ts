import { configDotenv } from "dotenv";
import bcrypt from "bcryptjs";
import { IUser, IUserCreateDTO, IUserResponseDTO, IUserUpdateDTO } from "../interfaces/IUser";
import { UserModel } from "../models/userModel";
import { HttpError } from "../errors/HttpError";
import { handleDatabaseErrors } from "../utils/handleDatabaseErrors";
import { SALT_ROUNDS } from "../config/jwt";
import { getHashPassword, isPasswordMatch } from "../utils/bcrypt";

configDotenv();

/**
 * @class UserService
 * UserService class to handle user-related operations such as login, retrieval, and management of user data.
 *
 * The class provides the following methods:
 * @method `login`: logs in a user with the given username or email and password.
 * @method `getUserById`: retrieves a user by their ID.
 * @method `getAllUsers`: retrieves all users from the database.
 * @method `createUser`: creates a new user with the provided data.
 * @method `updateUser`: updates an existing user with the provided data.
 * @method `deleteUser`: deletes a user by their ID.
 *
 * The methods are used for various operations such as authentication, user data retrieval, and user management.
 */
export class UserService {
  /**
   * Finds a user by their username or email.
   *
   * This method determines whether the provided identifier is an email or a username
   * and retrieves the corresponding user from the database.
   *
   * @param {Object} params - The parameters object.
   * @param {string} params.usernameOrEmail - The username or email of the user to find.
   * @returns {Promise<IUserResponseDTO | null>} A promise that resolves to the user object if found, otherwise null.
   */
  public async getUserByUsernameOrEmail({ usernameOrEmail }: { usernameOrEmail: string }): Promise<IUser | null> {
    const isEmail = usernameOrEmail.includes("@");
    let user;
    if (isEmail) {
      user = await UserModel.findOne({ email: usernameOrEmail });
    } else {
      user = await UserModel.findOne({ username: usernameOrEmail });
    }
    return user;
  }

  /**
   * @method isValidUsernameOrEmail
   * Checks if any username or email from the provided list exists in the database.
   *
   * @param {Object} params - The parameters object.
   * @param {string} params.usernameOrEmailList - The list of usernames or emails that we want to check.
   * @returns A list of users that exist in the database or an empty array if none are found.
   */
  public async isValidUsernameOrEmail({ usernameOrEmailList }: { usernameOrEmailList: string[] }): Promise<Pick<IUser, "_id" | "email" | "username">[] | []> {
    const user = await UserModel.find(
      {
        // $or to check by the username or email fields
        // $in to check if any username or email in the list exists in the database
        $or: [{ username: { $in: usernameOrEmailList } }, { email: { $in: usernameOrEmailList } }],
      },
      // return only these fields
      { _id: 1, username: 1, email: 1 }
    );
    return user;
  }

  /**
   * Logs in a user with the given username or email and password.
   *
   * This method checks if a user with the specified username or email exists.
   * If the user exists, it compares the provided password with the hashed password stored in the database.
   * If the passwords match, it returns the user data.
   *
   * @param {Object} params - The parameters object.
   * @param {string} params.usernameOrEmail - The username or email of the user attempting to log in.
   * @param {string} params.password - The password of the user attempting to log in.
   * @returns {Promise<IUserResponseDTO | never>} - A promise that resolves to the user data if the login is successful.
   * @throws Throws an `HttpError` if the user does not exist or if the password is incorrect.
   */
  public async login({ usernameOrEmail, password }: { usernameOrEmail: string; password: string }): Promise<IUserResponseDTO | never> {
    try {
      // Find the user by username or email
      const user = await this.getUserByUsernameOrEmail({ usernameOrEmail });

      // If the user does not exist, throw an error
      if (!user) throw new HttpError({ message: "Invalid credentials", statusCode: 401 });

      // Check if the password matches the hashed password
      const isMatch = await isPasswordMatch({ plainPassword: password, hashedPassword: user.password });

      // If the password does not match, throw an error
      if (!isMatch) throw new HttpError({ message: "Invalid credentials", statusCode: 401 });

      // Return the user data if the login is successful
      return user;
    } catch (error) {
      // Handle any errors that occur during login
      return handleDatabaseErrors({ error, defaultErrorMessage: "User login failed" });
    }
  }

  /**
   * Retrieves all users from the database.
   *
   * This method fetches all user records from the database and returns them in an array.
   * If the retrieval fails, it throws an error.
   *
   * @returns {Promise<IUserResponseDTO[] | never>} A promise that resolves to an array of all users if successful.
   * @throws Throws an `HttpError` if a database error occurs during retrieval.
   */
  public async getAllUsers(): Promise<IUserResponseDTO[] | never> {
    try {
      const users = await UserModel.find({});
      return users;
    } catch (error) {
      return handleDatabaseErrors({ error, defaultErrorMessage: "Couldn't get all users" });
    }
  }

  /**
   * Retrieves a user by their ID.
   *
   * This method fetches a user from the database using their unique identifier.
   * If the user is not found, it returns null.
   *
   * @param {Object} params - The parameters object.
   * @param {string} params.userId - The unique identifier of the user to retrieve.
   * @returns {Promise<IUserResponseDTO | null>} A promise that resolves to the user object if found, otherwise null.
   * @throws Throws an HttpError if a database error occurs during retrieval.
   */
  public async getUserById({ userId }: { userId: string }): Promise<IUserResponseDTO | null> {
    try {
      const user = await UserModel.findById(userId);
      return user;
    } catch (error) {
      return handleDatabaseErrors({ error, defaultErrorMessage: "Couldn't retrieve user by ID" });
    }
  }

  /**
   * Creates a new user in the database.
   *
   * This method accepts user data, hashes the password, and saves the new user to the database.
   * If the creation fails, it throws an error.
   *
   * @param {IUserCreateDTO} userData - The data for the new user to be created.
   * @returns {Promise<IUserResponseDTO | never>} - A promise that resolves to the created user data if successful.
   * @throws Throws an HttpError if a database error occurs during user creation.
   */
  public async createUser(userData: IUserCreateDTO): Promise<IUserResponseDTO | never> {
    try {
      const existingUsername = await this.getUserByUsernameOrEmail({ usernameOrEmail: userData.username });
      if (existingUsername) throw new HttpError({ message: "Username already exists", statusCode: 400 });

      const existingEmail = await this.getUserByUsernameOrEmail({ usernameOrEmail: userData.email });
      if (existingEmail) throw new HttpError({ message: "Email already exists", statusCode: 400 });

      const hashedPassword = await getHashPassword({ password: userData.password });

      const newUser = await UserModel.create({ ...userData, password: hashedPassword });

      return newUser;
    } catch (error) {
      return handleDatabaseErrors({ error, defaultErrorMessage: "User creation failed" });
    }
  }

  /**
   * Updates an existing user in the database.
   *
   * This method updates the user data based on the provided user ID.
   * If the update fails, it throws an error.
   *
   * @param {string} userId - The unique identifier of the user to update.
   * @param {IUserUpdateDTO} updateData - The data to update the user with.
   * @returns {Promise<IUserResponseDTO | never>} - A promise that resolves to the updated user data if successful.
   * @throws Throws an HttpError if a database error occurs during user update.
   */
  public async updateUser({ userId, updateData }: { userId: string; updateData: IUserUpdateDTO }): Promise<IUserResponseDTO | never> {
    try {
      const existing = await UserModel.findById(userId);
      // Check if the user exists
      if (!existing) throw new HttpError({ message: "Invalid User ID: User not found", statusCode: 400 });

      // check if the user has been modified since it was last retrieved
      if (new Date(existing.updatedAt!).getTime() !== new Date(updateData.updatedAt).getTime()) {
        throw new HttpError({ message: "User has been modified, get the updated one first", details: "The user has been modified since it was last retrieved", statusCode: 409 });
      }

      // check if the username already exists - do not allow duplicates
      if (updateData.username) {
        const existingUsername = await this.getUserByUsernameOrEmail({ usernameOrEmail: updateData.username });
        if (existingUsername && existingUsername._id !== updateData._id) throw new HttpError({ message: "Username already exists", statusCode: 400 });
      }
      // check if the email already exists - do not allow duplicates
      if (updateData.email) {
        const existingEmail = await this.getUserByUsernameOrEmail({ usernameOrEmail: updateData.email });
        if (existingEmail && existingEmail._id !== updateData._id) throw new HttpError({ message: "Email already exists", statusCode: 400 });
      }

      // update the user
      const updatedUser = (await UserModel.findByIdAndUpdate(userId, updateData, { new: true })) as IUserResponseDTO;

      return updatedUser;
    } catch (error) {
      return handleDatabaseErrors({ error, defaultErrorMessage: "User update failed" });
    }
  }

  /**
   * Deletes a user from the database.
   *
   * This method removes a user based on their unique identifier.
   * If the deletion fails, it throws an error.
   *
   * @param {string} userId - The unique identifier of the user to delete.
   * @returns {Promise<IUserResponseDTO | never>} - A promise that resolves if the deletion is successful.
   * @throws Throws an HttpError if a database error occurs during user deletion.
   */
  public async deleteUser(userId: string): Promise<IUserResponseDTO | never> {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(userId);
      if (!deletedUser) throw new HttpError({ message: "User not found", statusCode: 404 });
      return deletedUser;
    } catch (error) {
      return handleDatabaseErrors({ error, defaultErrorMessage: "User deletion failed" });
    }
  }
}
