import { configDotenv } from "dotenv";
import { HttpError } from "../errors/HttpError";

configDotenv();

export const NODE_ENV = process.env.NODE_ENV; // Node environment
export const SERVER_IP_ADDRESS = process.env.SERVER_IP_ADDRESS; // Hosting server IP address
export const VERCEL_DOMAIN_NAME = process.env.VERCEL_DOMAIN_NAME; // Vercel hosting server domain name (for development)
export const DOMAIN_NAME = process.env.DOMAIN_NAME; // Hosting server domain name
export const PUBLIC_PORT = process.env.PUBLIC_PORT; // Hosting server exposed port to access the backend server
export const PORT = process.env.PORT; // Backend server port
export const MONGO_URL = process.env.MONGO_URL; // MongoDB URL
export const JWT_SECRET = process.env.JWT_SECRET; // JWT secret

if (!SERVER_IP_ADDRESS) throw new HttpError({ message: "Missing `SERVER_IP_ADDRESS` in the enviroment variable", statusCode: 500 });
if (!DOMAIN_NAME) throw new HttpError({ message: "Missing `DOMAIN_NAME` in the enviroment variable", statusCode: 500 });
if (!PUBLIC_PORT) throw new HttpError({ message: "Missing `PUBLIC_PORT` in the enviroment variable", statusCode: 500 });
if (!PORT) throw new HttpError({ message: "Missing `PORT` in the enviroment variable", statusCode: 500 });
if (!MONGO_URL) throw new HttpError({ message: "Missing `MONGO_URL` in the enviroment variable", statusCode: 500 });
if (!JWT_SECRET) throw new HttpError({ message: "Missing `JWT_SECRET` in the enviroment variable", statusCode: 500 });
