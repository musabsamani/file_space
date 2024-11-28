import { model, Schema } from "mongoose";
import { IUser } from "../interfaces/IUser";

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, minlength: 8 },
});

export default model<IUser>("User", UserSchema);
