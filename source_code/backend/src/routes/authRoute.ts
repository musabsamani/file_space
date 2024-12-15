import { Router } from "express";
import * as user from "../controllers/userController";
import * as auth from "../controllers/authController";
import { validateRequestBody } from "../middlewares/validateRequestBody";
import { userLogin, userCreate } from "../validations/userValidationSchema";

export const router = Router();

// to handle user registration
router.use("/register", validateRequestBody(userCreate), user.createUser);

// to handle user login
router.use("/login", validateRequestBody(userLogin), auth.login);
