const { body } = require("express-validator");

function handleValidationError(
  bodyTitle,
  errorEmpty,
  min = 1,
  max = 20,
  errorLength
) {
  return body(bodyTitle)
    .notEmpty()
    .trim()
    .withMessage(errorEmpty)
    .isLength({ min, max })
    .withMessage(errorLength);
}

module.exports = {
  handleValidationError,
};
