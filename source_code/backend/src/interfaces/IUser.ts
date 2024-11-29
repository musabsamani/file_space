/**
 * Interface for user object
 */
export interface IUser {
  fullname: string;
  username: string;
  email: string;
  password: string;
}
/**
 * Interface for user object
 */
export interface IUserResponseDTO {
  // _id: string;
  fullname: string;
  username: string;
  email: string;
  // __v?: number;
}
/**
 * Interface for user object
 */
export interface IUserLogin {
  usernameOrEmail: string;
  password: string;
}
