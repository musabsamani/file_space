/**
 * Interface for user object
 */
export interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
}
/**
 * Interface for user object
 */
export interface IUserResponseDTO {
  // _id: string;
  name: string;
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
