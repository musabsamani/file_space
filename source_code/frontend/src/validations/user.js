import * as yup from "yup";
import { FULLNAME_MIN_LENGTH, PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from "../constants";

export const userRegistrationSchema = yup.object().shape({
    fullname: yup.string().min(FULLNAME_MIN_LENGTH, "Full Name must be at least 5 characters").required("Full Name is required"),
    username: yup.string()
        .min(USERNAME_MIN_LENGTH, "Username must be at least 5 characters")
        .trim()
        .matches(
            /^[a-zA-Z0-9]+$/,
            "Username must not contain special characters or spaces"
        )
        .required("Username is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().min(PASSWORD_MIN_LENGTH, "Password must be at least 8 characters").required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([
            yup.ref(
                // make sure the `password` in this password confirmation is referencing the original password field
                "password"
            ), null], "Passwords must match")
        .required("Confirm Password is required"),
    marketing_accept: yup.boolean()
        .oneOf([true], "You must accept the terms and conditions to create account")
        .required("You must accept the terms and conditions to create account"),
});

export const userLoginSchema = yup.object().shape({
    usernameOrEmail: yup
        .string()
        .required("Username or Email is required"),
    password: yup
        .string()
        .required("Password is required"),
});