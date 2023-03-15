const { ALGORITHM, TOKEN_EXPIRES_IN, FROM_EMAIL } = require("../config/env");

/**
 * JWT Generations Configs
 */
const options = {
  algorithm: ALGORITHM,
  expiresIn: TOKEN_EXPIRES_IN,
};

/**
 * Mail Configs
 */
const mailDetails = {
  from: FROM_EMAIL,
};

/**
 * Swagger Configs
 */
const swaggerOptions = {
  swaggerOptions: { filter: "", persistAuthorization: true },
  customSiteTitle: "User Authentication Swagger",
};

module.exports = {
  options,
  mailDetails,
  swaggerOptions,
};
