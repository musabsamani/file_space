import { create } from "domain";
import { NextFunction, Request, Response, Router } from "express";
import { createResponseObject } from "../utils/createResponseObject";

export const router = Router();
router.all("/", (req: Request, res: Response): void => {
  res.json(createResponseObject({ data: { message: "HELLO_WORLD !!", details: "server is up and running !!" } }));
});
