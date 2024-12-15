import { dirname, join } from "path";
import { DOMAIN_NAME, PORT, PUBLIC_PORT, SERVER_IP_ADDRESS, VERCEL_DOMAIN_NAME } from "./env";

/**
 * The allowed origins for CORS.
 * This is used to restrict the domains that can access the server.
 */
export const allowedOrigins = [
  // for accessing the backend api using the host server exposed port with
  // 1 with the domain name
  `https://${DOMAIN_NAME}:${PUBLIC_PORT}`, // Example: https://mydomain:3000/api
  // 2 with the ip address
  `https://${SERVER_IP_ADDRESS}:${PUBLIC_PORT}`, // Example: https://192.33.312.565:3000/api

  // for accessing the frontend
  `https://${SERVER_IP_ADDRESS}`,
  `http://${SERVER_IP_ADDRESS}`,
  `http://${DOMAIN_NAME}`,
  `https://${DOMAIN_NAME}`,
  `http://www.${DOMAIN_NAME}`,
  `https://www.${DOMAIN_NAME}`,
  // for vercel development
  `https://${VERCEL_DOMAIN_NAME}`,
  `https://www.${VERCEL_DOMAIN_NAME}`,

  // for the frontend to access the backend server in production since they run on the same server
  // and make sure the server listens on this port
  `http://localhost:${PORT}`,

  // the vite port for serving the react app during development
  // make sure to set the vite port in the vite.config.ts to 3000 to mathch this value
  `http://localhost:3000`,
];

const UPLOAD_FOLDER = "uploads/";

// for creating the uploads folder
export const uploadDir = join(
  dirname(dirname(__dirname)),
  // remove `/` from the path
  UPLOAD_FOLDER.replace("/", "")
);

/**
 * List of allowed MIME types for file uploads using multer.
 * This ensures that only files with the specified MIME types are accepted.
 */
export const multerAllowedMimeTypes = [
  // Image MIME types
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/tiff",
  "image/bmp",
  "image/svg+xml",
  "image/x-icon",
  "image/heif",
  "image/heic",
  "image/avif",
  // Video MIME types
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-ms-wmv",
  "video/x-matroska",
  "video/webm",
  "video/3gpp",
  "video/3gpp2",
  "video/ogg",
  "video/x-flv",
  "video/x-m4v",
  "video/x-mng",
];

/**
 * The maximum file size allowed for uploads, in bytes.
 * `100 MB`
 * @constant {number}
 */
export const MAX_FILE_SIZE = 100 * 1024 * 1024;
