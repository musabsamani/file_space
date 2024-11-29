import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { IUser, IUserResponseDTO } from "../interfaces/IUser";
import User from "../models/user";
import { SALT } from "../constants";
import { HttpError } from "../errors/HttpError";
import { handleDatabaseError } from "../utils/handleDatabaseError";

dotenv.config();

export class UserService {
  /**
   * Registers a new user in the datase.
   *
   * This function checks if a user with the given email or username already exists.
   * If not, it hashes the password and creates a new user entry in the database.
   *
   * @param {IUser} param0 - An object containing user details: email, password, fullname, and username.
   * @returns {Promise<IUserResponseDTO | never>} - The newly created user data without the password.
   * @throws {HttpError} - If the user already exists or if a database error occurs.
   */
  public async registerUser({ email, password, fullname, username }: IUser): Promise<IUserResponseDTO | never> {
    try {
      const existingUserEmail = await User.findOne({ email });
      const existingUsername = await User.findOne({ username });

      if (existingUserEmail) throw new HttpError({ message: "user already exists, duplicted email", statusCode: 400 });
      if (existingUsername) throw new HttpError({ message: "user already exists, duplicted username", statusCode: 400 });

      const hashedPassword = await bcrypt.hash(password, SALT);

      const newUser = await User.create({ fullname, username, email, password: hashedPassword });

      // Exclude the password from the response
      const { password: _password, ...newUserWithoutPassword } = newUser.toObject();

      // Return the user data without the password
      return newUserWithoutPassword;
    } catch (error) {
      return handleDatabaseError({ error, defaultMessage: "user registration failed" });
    }
  }

  /**
   * Logs in a user with the given username or email and password.
   *
   * This function checks if a user with the given username or email exists.
   * If yes, it compares the given password with the hashed password in the database.
   * If the passwords match, it returns the user data.
   *
   * @param {string} usernameOrEmail - The username or email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<IUser | null | never>} - The user data if the login is successful or null if the login fails.
   * @throws {HttpError} - If the user does not exist or if a database error occurs.
   */
  public async login({ usernameOrEmail, password }: { usernameOrEmail: string; password: string }): Promise<IUser | null | never> {
    try {
      const isEmail = usernameOrEmail.includes("@");
      let user;
      if (isEmail) {
        user = await User.findOne({ email: usernameOrEmail });
      } else {
        user = await User.findOne({ username: usernameOrEmail });
      }
      // convert user to object so password extracted by destructuring => ...userWithoutPassword
      return user ? user.toObject() : null;
    } catch (error) {
      return handleDatabaseError({ error, defaultMessage: "user login failed" });
    }
  }
}
