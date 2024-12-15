import { model, Schema } from "mongoose";
import { IFile, IFileViews } from "../interfaces/IFile";
import { filePrivacyObject } from "../config/enums";

const viewSchema = new Schema<IFileViews>({
  country: {
    type: Map,
    of: Number,
    default: {},
  },
  emirates: {
    type: Map,
    of: Number,
    default: {},
  },
});

const FileSchema = new Schema<IFile>(
  {
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: false },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true },
    encoding: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    privacy: { type: String, required: true, enum: Object.values(filePrivacyObject), default: filePrivacyObject.PRIVATE },
    invitedUsers: { type: [Schema.Types.ObjectId], ref: "User", required: true, default: [] },
    blockedUsers: { type: [Schema.Types.ObjectId], ref: "User", required: true, default: [] },
    views: { type: viewSchema },
    tags: { type: [String], required: true, default: [] },
  },
  { timestamps: true }
);

export const FileModel = model<IFile>("File", FileSchema);
