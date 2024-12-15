import Joi from "joi";
import { filePrivacyObject } from "../config/enums";

export const joiObjectId = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    "string.pattern.base": "Invalid ObjectId format",
  });

/** Generic file validation schema used as basic validation for other validating file schemas */
const fileBasicFields = {
  _id: joiObjectId.required(),
  tags: Joi.array().items(Joi.string().optional()).optional(),
  invitedUsers: Joi.array().items(joiObjectId.optional()).optional().default([]),
  blockedUsers: Joi.array().items(joiObjectId.optional()).optional().default([]),
  privacy: Joi.string()
    .valid(...Object.values(filePrivacyObject))
    .required()
    .messages({
      "any.only": `Privacy must be one of the following values: ${Object.values(filePrivacyObject)}`,
    }),

  updatedAt: Joi.date().required(),
};

/**
 * Validation schema for file upload
 */
export const fileUpload = Joi.object({
  tags: fileBasicFields.tags,
});
/**
 * Validation schema for file settings file tags
 */
export const setFileTags = Joi.object({
  tags: fileBasicFields.tags,
  updatedAt: fileBasicFields.updatedAt,
});

/**
 * Validation schema for file settings privacy level
 */
export const setFilePrivacy = Joi.object({
  privacy: fileBasicFields.privacy,
  updatedAt: fileBasicFields.updatedAt,
});

/**
 * Validation schema for file settings invited users list
 */
export const setInvitedUsers = Joi.object({
  invitedUsers: fileBasicFields.invitedUsers,
  updatedAt: fileBasicFields.updatedAt,
});

/**
 * Validation schema for file settings blocked users list
 */
export const setBlockedUsers = Joi.object({
  blockedUsers: fileBasicFields.blockedUsers,
  updatedAt: fileBasicFields.updatedAt,
});
