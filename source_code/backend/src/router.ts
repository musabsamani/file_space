import cookieParser from "cookie-parser";
import { existsSync, mkdirSync } from "fs";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { allowedOrigins, uploadDir } from "./config/server";
import { router as routes } from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { healthCheck } from "./routes/healthCheckRoute";
import { handleUndefinedEndpoints } from "./middlewares/handleUndefinedEndpoints";

export const router = (app: express.Application) => {
  // create the uploads folder if it doesn't exist
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }

  // Middlewares for parsing the cookie
  app.use(cookieParser());

  // for logging incoming requests details in development (requests /path + paramas + status code)
  app.use(morgan("dev"));

  // for parsing application/json request body
  app.use(express.json());

  // for parsing application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  // for enabling cors
  app.use(
    cors({
      // block any requests that are not from the allowed origins
      origin: allowedOrigins,
      // allow credentials for cookies
      credentials: true,
    })
  );

  // for handling incomming requests from the client to `/api/v1` routes
  // v1 is the version of the api
  app.use("/api/v1", routes);

  // a root route to verify server status
  app.use(healthCheck());

  // for handling undefined endpoints
  app.use(handleUndefinedEndpoints);

  // for handling errors
  app.use(errorMiddleware);
};
