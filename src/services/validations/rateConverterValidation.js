const ErrorModule = require('../../custom_modules/error_module/errors');
const { BadRequest, Unauthorized } = new ErrorModule();
const { isNull } = require('../../custom_modules/util_module/utils');
const { environment } = require('../../../environments');
const { RETURN_STRINGS } = require('../../configs/defaults');

module.exports.rateConverterValidation = (req, res, next) => {
  if (Object.keys(req.query).length === 0) {
    next(BadRequest(RETURN_STRINGS.MISSING_BODY));
  } else if (isNull(req.query.amount)) {
    next(BadRequest(RETURN_STRINGS.GENERIC_MISSING_FIELD_MSG));
  } else {
    next();
  }
};

module.exports.historicalDataValidation = (req, res, next) => {
  if (Object.keys(req.query).length === 0) {
    next(BadRequest(RETURN_STRINGS.MISSING_BODY));
  } else if (isNull(req.query.currencies) || isNull(req.query.frequency)) {
    next(BadRequest(RETURN_STRINGS.GENERIC_MISSING_FIELD_MSG));
  } else {
    next();
  }
};
