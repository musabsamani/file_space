import { Router } from "express";
import * as auth from "../controllers/auth";
import { validateRequestBody } from "../middlewares/validateRequestBody";
import { userlogin, userRegistration } from "../validations/uservalidationSchema";
import { fileUpload } from "../validations/uploadvalidationSchema";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multer";
export const router = Router();

// to handle user registration
router.use("/register", validateRequestBody(userRegistration), auth.register);

// to handle user login
router.use("/login", validateRequestBody(userlogin), auth.login);

// upload files
// router.post("/upload", authMiddleware, auth.upload);
router.post("/upload", [authMiddleware, validateRequestBody(fileUpload), upload.single("file")], auth.upload);
