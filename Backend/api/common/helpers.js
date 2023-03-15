// const { sgMail } = require("./../config/mail.config");
// const { FROM_EMAIL } = require("../config/env");
// const path = require("path");
// const { TOKEN_EXPIRES_IN } = require("../config/env");
// const crypto = require("crypto");
// const jwt = require("jsonwebtoken");
const ether = require("ethers"),
  fs = require("fs"),
  Handlebars = require("handlebars"),
  { PASSCODE_LENGTH } = require("../config/env"),
  { createHmac } = require("crypto"),
  { logger } = require("../config/logger.config");

const HelperFunction = function () {
  /**
   * @description create response payload.
   * @param { 400 | 401 | 500 | 200 | 201} code - defines response's code
   * @param { boolean } status - defines request's success or failure
   * @param { string } message - defines message
   * @param { string } data - an optional parameter to pass data
   * @returns
   */
  const createResponse = function (code, status, message, data = null) {
    const response = { code, status, message };
    if (data) response.data = data;
    return response;
  };

  /**
   * @description send email.
   * @param {Object} mailDetails
   * @param {string} templateName
   * @param {Object} data
   */
  const sendEmail = async function (mailDetails, templateName, data) {
    const html = await getTemplate(templateName, data);
    mailDetails.html = html;
    try {
      mailTransporter.sendMail(mailDetails, function (err, result) {
        if (!err) logger.info(`Email sent successfully to ${data.name}`);
      });
    } catch (error) {
      logger.error(error.message);
    }
  };

  /**
   * @description get template to send in email
   * @param { string } templateName
   * @param { Object } data
   * @returns
   */
  const getTemplate = async function (templateName, data) {
    return new Promise((resolve, rejects) => {
      fs.readFile(
        process.cwd() + `${TEMPLATES_PATH}/${templateName}/index.html`,
        function (err, fileData) {
          if (!err) {
            const template = fileData.toString();
            const HandleBarsFunction = Handlebars.compile(template);
            const html = HandleBarsFunction(data);
            resolve(html);
          } else {
            logger.error(err.message);
            rejects(err);
          }
        }
      );
    });
  };

  const genratePasscode = function () {
    return Math.floor(Math.random() * 10 ** PASSCODE_LENGTH);
  };

  /**
   * @description generates hash of provided string
   * @param {Object} data
   * @returns
   */
  const generateHash = function (data) {
    const hash = createHmac(PASS_ENCRYPTION, SECRET_KEY);
    return hash.update(data).digest(ENCODING);
  };

  const signAndGet = function (data) {
    return new Promise((resolve, rejects) => {
      generateKeyPair(
        "dsa",
        {
          modulusLength: 2048,
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        },
        (err, publicKey, privateKey) => {
          if (!err) {
            const token = jwt.sign(data, privateKey, options);
            resolve({
              publicKey,
              token,
            });
          } else {
            rejects(err);
          }
        }
      );
    });
  };

  /**
   * @description verify jwt token.
   * @param {String} token
   * @param {String} publicKey
   * @returns
   */
  const verifyToken = function (token, publicKey) {
    try {
      jwt.verify(token, publicKey, options);
      return true;
    } catch (error) {
      logger.error(error.message);
      return false;
    }
  };

  /**
   * @description logs errors in logger files.
   * @param {Object} error
   * @param {String} currentFileName
   * @returns
   */
  const loggerError = function (error, currentFileName) {
    logger.error(
      `Error thrown: '${error.message}'. File: '${currentFileName}'`
    );
  };

  /**
   * @description returns a new instance of a Contract attached to a given address.
   * @param {String} contractAddress
   * @param {JSON} contractAbi
   * @param {Object} providers
   * @returns
   */
  const initializeContract = function (
    contractAddress,
    contractAbi,
    providers
  ) {
    return new ether.Contract(contractAddress, contractAbi, providers);
  };

  return {
    createResponse,
    sendEmail,
    getTemplate,
    genratePasscode,
    generateHash,
    signAndGet,
    verifyToken,
    loggerError,
    initializeContract,
  };
};

module.exports = {
  HelperFunction: HelperFunction(),
};
