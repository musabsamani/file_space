import { Request, Response } from "express";
import { createResponseObject } from "../utils/createResponseObject";
import winston from "winston";

export const errorMiddleware = (error: Error, req: Request, res: Response) => {
  winston.error(error.message, error);
  res.status(500).json(createResponseObject({ error: { message: "internal server error", details: error.message } }));
};
