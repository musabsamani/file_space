import { Schema } from "mongoose";
import { UserRoleType } from ".";
import { Document } from "mongoose";

/**
 * Interface for user object that includes the basic user fields
 */
export interface IUserBasic {
  fullname: string;
  username: string;
  email: string;
  password: string;
  userRole: UserRoleType;
}

/**
 * Interface for User object that extends the basic User object and includes the Document interface
 * it is the used as database interface for UserModel
 */
export interface IUser extends IUserBasic, Document {
  _id: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface for user response - excluding password
 */
export interface IUserResponseDTO extends Omit<IUser, "password"> {}

/**
 * Interface for user create
 */
export interface IUserCreateDTO extends Omit<IUser, "createdAt" | "updatedAt"> {}

/**
 * Interface for user update
 */
export interface IUserUpdateDTO extends Partial<IUser> {
  _id: Schema.Types.ObjectId;
  updatedAt: Date;
}

/**
 * Interface for user token
 *
 * This interface represents the structure of a user token object,
 * typically used for authentication or authorization purposes.
 */
export interface IUserToken extends Omit<IUserBasic, "password"> {
  _id: Schema.Types.ObjectId;
}

/**
 * Interface for user login
 */
export interface IUserLogin {
  usernameOrEmail: string;
  password: string;
}
