import express from "express";
import { router as routes } from "./routes";
import { apiUrls } from "./config";
import cors from "cors";
import exp from "constants";
import cookieParser from "cookie-parser";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import morgan from "morgan";
import { handleUndefinedEndpoints } from "./middlewares/handleUndefinedEndpoints";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { UPLOAD_FOLDER } from "./constants";

export const router = (app: express.Application) => {
  // for creating the uploads folder
  const uploadDir = path.join(
    path.dirname(__dirname),
    // remove `/` from the path
    UPLOAD_FOLDER.replace("/", "")
  );

  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }

  // Middlewares for parsing the cookie
  app.use(cookieParser());

  // for logging incoming requests details in development (requests /path + paramas + status code)
  app.use(morgan("dev"));

  // for parsing application/json request body
  app.use(express.json());

  // for serving static files on /public
  app.use(express.static("public"));

  // for parsing application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  // for enabling cors
  app.use(cors({ origin: apiUrls.baseUrl, credentials: true }));

  // for handling incomming requests from the client to /api/v1 routes
  app.use("/api/v1", routes);

  // for handling undefined endpoints
  app.use(handleUndefinedEndpoints);

  // for handling errors
  app.use(errorMiddleware);
};
