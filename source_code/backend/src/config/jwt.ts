/**
 * The hashing salt for bcrypt . `10 Rounds`
 *
 * @constant {number}
 */
export const SALT_ROUNDS = 10;

/**
 * JWT expiration object containing different expiration durations.
 *
 * @constant {Object}
 * @property {string} veryLong - Expiration duration of 45 days.
 * @property {string} long - Expiration duration of 15 days.
 * @property {string} medium - Expiration duration of 1 day.
 * @property {string} short - Expiration duration of 1 hour.
 * @property {string} veryShort - Expiration duration of 15 minutes.
 */
export const JWT_EXPIRATION = {
  veryLong: "45d",
  long: "15d",
  medium: "1d",
  short: "1h",
  veryShort: "15m",
};
