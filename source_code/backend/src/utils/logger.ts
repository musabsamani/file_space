import winston from "winston";

/** a name for combined log file */
const combinedFile = "combined.log";

/** a name for exception log file */
const exceptionsFile = "exceptions.log";

/** custom log levels */
const customLevels = {
  audit: 0,
  error: 1,
  warn: 2,
  info: 3,
};

// interface for custom logger
interface CustomLogger extends winston.Logger {
  audit: (message: string, err?: any) => void;
}

/**
 * Configures logging for the application using `winston` logger
 *
 * Sets up transports for logging to both files and the console.
 * Sets up exception handlers for logging exceptions to both files and the console.
 */
export const logger = winston.createLogger({
  levels: customLevels,
  transports: [
    // Log to all levels to combined.log (all level above `audit` `3`)
    new winston.transports.File({
      filename: combinedFile,
      format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
    }),
  ],

  // set up exception handlers
  exceptionHandlers: [
    // Log exceptions to the console
    new winston.transports.Console({
      format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
    }),

    // Log exceptions to a file
    new winston.transports.File({
      filename: exceptionsFile,
      format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
    }),
  ],
}) as CustomLogger;

/**
 * Configures custom `winston` logger for loggin authentication related actions and CRUD operations
 *
 * it used to log only level:`audit` `3`
 */
export const customLogger: CustomLogger = winston.createLogger({
  levels: customLevels,
  transports: [
    // Log to combined.log
    new winston.transports.File({
      // make sure it doesn't overwrite the combined.log defined earlier in `logger` (if winston version is updated)
      filename: combinedFile,
      format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
    }),

    // Log level auth logs to auth.log
    new winston.transports.File({
      level: "audit",
      filename: "audit.log",
      format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
    }),
  ],
}) as CustomLogger;

// add console transport based on environment
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
  customLogger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
