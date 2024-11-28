import { Request, Response } from "express";
import { createResponseObject } from "../utils/createResponseObject";
import { IUser, IUserLogin } from "../interfaces/IUser";
import { handleContollerError } from "../utils/handleContollerError";
import { UserService } from "../services/userService";
import { HttpError } from "../errors/HttpError";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

export const get = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new HttpError({ message: "No file uploaded", statusCode: 400 });
    }

    // Return file information
    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file, // 'file' will contain file details
    });
  } catch (error) {
    handleContollerError({ error, res, defaultErrorMessage: "uploading file failed" });
  }
};
