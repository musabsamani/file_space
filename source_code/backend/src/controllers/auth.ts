import { Request, Response } from "express";
import { createResponseObject } from "../utils/createResponseObject";
import { IUser, IUserLogin, IUserResponseDTO } from "../interfaces/IUser";
import { handleContollerError } from "../utils/handleContollerError";
import { UserService } from "../services/userService";
import { HttpError } from "../errors/HttpError";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
// import supabase from "../config/supabase";
import { STORAGE_BUCKET_NAME } from "../constants";
import { v4 as uuidv4 } from "uuid";

const userService = new UserService();

/**
 * Handles user registration.
 *
 * This function extracts user details from the request body, calls the
 * UserService to register the user, and sends a response indicating the
 * success or failure of the registration process.
 *
 * @param {Request} req - The request object containing user details for registration.
 * @param {Response} res - The response object used to send back the result of the registration.
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password } = req.body as IUser;

    // call user service in the database layer
    const newUser = await userService.registerUser({ name, username, email, password });

    res.json(createResponseObject({ data: { message: "User created successfully", user: newUser } }));
  } catch (error) {
    handleContollerError({ error, res, defaultErrorMessage: "user registration failed" });
  }
};

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
export const login = async (req: Request, res: Response) => {
  try {
    const { usernameOrEmail, password } = req.body as IUserLogin;

    const user = await userService.login({ usernameOrEmail, password });

    if (!user) throw new HttpError({ message: "invalid credentials", statusCode: 401 });

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) throw new HttpError({ message: "invalid credentials", statusCode: 401 });

    const { password: pass, ...userWithoutPassword } = user;

    const token = generateToken(userWithoutPassword);
    res
      .status(200)
      .setHeader("Authorization", `Bearer ${token}`)
      .json(createResponseObject({ data: userWithoutPassword }));
  } catch (error) {
    handleContollerError({ error, res, defaultErrorMessage: "user registration failed" });
  }
};

export const upload = async (req: Request, res: Response) => {
  try {
    // Get the uploaded file
    const file = req.file;

    // get user from request
    const user: any = (req as any).user;

    // check if file is present in the request body
    if (!file) {
      throw new HttpError({ message: "No file uploaded", statusCode: 400 });
    }

    const { tags } = req.body;
    const fileUrl = file.filename;

    console.log(file);
    // Return file information
    res.status(200).json(
      createResponseObject({
        data: {
          message: "File uploaded successfully",
          fileUrl,
          tags,
          file: req.file, // 'file' will contain file details
        },
      })
    );
  } catch (error) {
    handleContollerError({ error, res, defaultErrorMessage: "uploading file failed" });
  }
};
