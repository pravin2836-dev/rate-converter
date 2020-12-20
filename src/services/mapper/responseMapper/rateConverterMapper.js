const { RETURN_STRINGS } = require('../../../configs/defaults');
const { isNull } = require('../../../custom_modules/util_module/utils');

module.exports.rateConverterResponseMapper = (params) => {
  console.log(params)
  let response = {};
  response['usdValue'] = (isNull(params.usdValue) ? RETURN_STRINGS.NOT_APPLICABLE : params.usdValue);
  return response;
};