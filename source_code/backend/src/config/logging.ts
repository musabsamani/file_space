import winston from "winston";

/**
 * Configures logging for the application using Winston.
 *
 * Sets up transports for logging to both files and the console.
 * Sets up exception handlers for logging exceptions to both files and the console.
 */
export const logging = () => {
  // Configure winston
  winston.configure({
    transports: [
      // Log to a file
      new winston.transports.File({
        filename: "logfile.log",
        format: winston.format.prettyPrint(),
      }),

      // Log to the console
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
    exceptionHandlers: [
      // Log exceptions to a file
      new winston.transports.File({
        filename: "exceptions.log",
        format: winston.format.prettyPrint(),
      }),

      // Log exceptions to the console
      new winston.transports.Console({
        format: winston.format.prettyPrint(),
      }),
    ],
  });
};
