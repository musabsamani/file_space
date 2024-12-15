import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../interfaces/IUser";
import { SALT_ROUNDS } from "../config/jwt";
import { userRoleObject } from "../config/enums";

const UserSchema = new Schema<IUser>(
  {
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    userRole: { type: String, required: true, enum: Object.values(userRoleObject), default: userRoleObject.USER },
    email: { type: String, required: true, match: /.+@.+\..+/ },
    password: { type: String, required: true, minlength: 8 },
  },
  { timestamps: true }
);

// middleware to remove password from user object
UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password; // Remove the password field
    return ret; // Return the modified object
  },
});

export const UserModel = model<IUser>("User", UserSchema);
