import { Document, Schema } from "mongoose";
import { FilePrivacyType } from ".";

/**
 * Interface for tracking views
 *
 * @interface IFileViews
 * @property {Map<string, number>} country - For tracking views by country, e.g., { "US": 10, "UK": 5 }
 * @property {Map<string, number>} Emirates - For tracking views by UAE Emirates, e.g., { "DU": 10, "SH": 5 }
 */
export interface IFileViews {
  // for tracking views by country
  // for example, { "US": 10, "UK": 5 }
  country: Map<string, number>;
  // for tracking views by UAE Emirates
  // for example, { "DU": 10, "SH": 5 }
  emirates: Map<string, number>;
}

/**
 * Interface for basic File object
 */
export interface IFileBasic {
  originalName: string;
  filename: string;
  size: number;
  path: string;
  mimetype: string;
  encoding: string;
  owner: Schema.Types.ObjectId;
  privacy: FilePrivacyType;
  invitedUsers: Schema.Types.ObjectId[];
  blockedUsers: Schema.Types.ObjectId[];
  tags: string[];
  views: IFileViews;
}

/**
 * Interface for File object that extends the basic File object and includes the Document interface
 * it is the used as database interface for FileModel
 */
export interface IFile extends IFileBasic, Document {
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface for File response
 */
export interface IFileResponseDTO extends IFile {}

/**
 * Interface for File create
 */
export interface IFileCreateDTO extends Omit<IFileBasic, "views"> {}

/**
 * Interface for File update
 */
export interface IFileUpdateDTO extends Partial<IFile> {
  _id: "string";
  updatedAt: Date;
}
