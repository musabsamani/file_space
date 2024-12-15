import { Request, Response, Router } from "express";
import { createResponseObject } from "../utils/createResponseObject";

export const router = Router();
/**
 * A middleware function that sets up a single route,
 * which responds with a JSON object indicating that the server is up and running.
 *
 * @returns The router with the single route.
 */
export const healthCheck = () =>
  // match all requests to the root route with various methods
  router.all("/", (req: Request, res: Response): void => {
    res.json(createResponseObject({ data: { message: "HELLO_WORLD !!", details: "server is up and running !!" } }));
  });
