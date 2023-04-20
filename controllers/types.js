/**
 * API response object
 * @typedef {Object} APIResponse
 * @property {string} [_msg] - Optional message to show
 * @property {Array|Object} [data] - Response payload / data
 * @property {string} [error] - Error message if an error occurred
 */

/**
 * Validate the API response against the APIResponse type
 * @param {APIResponse} response - The API response to validate
 * @returns {boolean} - Whether the response matches the APIResponse type or not
 */
const validateResponse = (response) => {
  if (
    response &&
    typeof response === "object" &&
    (response._msg === undefined || typeof response._msg === "string") &&
    (response.data === undefined ||
      Array.isArray(response.data) ||
      typeof response.data === "object") &&
    (response.error === undefined || typeof response.error === "string")
  ) {
    return true;
  }
  return false;
};

module.exports = validateResponse;
