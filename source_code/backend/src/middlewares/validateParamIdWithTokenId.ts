import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/HttpError";
import { handleControllerErrors } from "../utils/handleControllerErrors";
import { CustomRequest } from "../interfaces";

export const validateParamIdWithTokenId = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const paramsId = req.params.id;
    if (!paramsId) {
      throw new HttpError({ message: "missing id in the request parameters", statusCode: 400 });
    }
    const user = req.user;
    if (!user || Object.keys(user).length === 0) {
      throw new HttpError({ message: "Unauthorized: User Authentication failed", details: "Missing user in the request", statusCode: 401 });
    }
    const tokenId = user._id;
    if (!tokenId) {
      throw new HttpError({ message: "missing id in the decoded token", statusCode: 500 });
    }
    if (tokenId !== paramsId) {
      throw new HttpError({ message: "Forbidden: User does not have sufficient privileges to access this resource", details: "can't access other user's files", statusCode: 403 });
    }
    // if the id in the request parameters matches the id in the decoded token, proceed to the next middleware
    next();
  } catch (error) {
    handleControllerErrors({ error, res, defaultErrorMessage: "Unauthorized" });
  }
};
