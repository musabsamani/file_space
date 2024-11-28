import { Router } from "express";
import { router as auth } from "./authRout";
import { router as healthCheckEndpoint } from "./healthCheckEndpoint";
import * as upload from "../controllers/upload";

export const router = Router();

// a route to handle authentication
router.use("/auth", auth);

// a route to handle accessing files
router.post("/upload", upload.get);

// a root route to verify server status
router.use("/", healthCheckEndpoint);
