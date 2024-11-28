import { Request } from "express";

/**
 * Custom request interface that extends the Express Request interface.
 * This interface is used to type-check the request object in routes and middleware.
 * It adds the user property which contains the user data from the database.
 */
export interface CustomRequest extends Request {
  user: {
    _id: string;
    name: string;
    username: string;
    email: string;
    __v: number;
  };
  file?: Express.Multer.File;
}
