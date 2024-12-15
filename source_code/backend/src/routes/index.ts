import { Router } from "express";
import { router as auth } from "./authRoute";
import { router as users } from "./userRoute";
import { router as files } from "./fileRoute";

export const router = Router();

// a route to handle authentication - login and registration
router.use("/auth", auth);

// a route to handle user management
router.use("/users", users);

// a route to handle accessing files
router.use("/files", files);
