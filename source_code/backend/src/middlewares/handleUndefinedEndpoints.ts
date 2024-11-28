import { Request, Response } from "express";
import { createResponseObject } from "../utils/createResponseObject";
export const handleUndefinedEndpoints = (req: Request, res: Response) => {
  res.status(404).json(
    createResponseObject({
      error: {
        message: "API endpoint not found",
        details: `Path '${req.originalUrl}' not found on server routes`,
      },
    })
  );
};
