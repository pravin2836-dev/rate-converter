const {  
  RETURN_STRINGS,
  API_ACCESS_KEY
} = require('../configs/defaults');
const axios = require("axios").default;
const {environment} = require("../../environments");
const ErrorModule = require("../custom_modules/error_module/errors");
const {CallFailed, BadRequest} = new ErrorModule();
const {rateConverterResponseMapper} = require('./mapper/responseMapper/rateConverterMapper');
const moment = require("moment");

module.exports.rateConverter = (params, rateConverterCallback) => {
  let converterURL = `${environment.EXTERNAL_INTERACTION_BASE_URL}live?access_key=${API_ACCESS_KEY}&currencies=INR`;
  const method = "GET";
  let options = {
    url: converterURL,
    method
  };

  axios(options)
    .then(res=>{
      let response = res.data;
      let usdValue = +(Math.round((params.amount/response.quotes.USDINR) + "e+3")  + "e-3");
      let convertedValue = rateConverterResponseMapper({usdValue: usdValue});
      rateConverterCallback(null, convertedValue);
    }).catch(err=>{
      rateConverterCallback(null, err);
    });
};

module.exports.historicalData = (params, historicalDataCallback) => {
  let lastNoDays = [];
  var historicalDataRates = [];

  for(let i= 1;i <= params.frequency; i++) {
    lastNoDays.push(moment().subtract(i,'d').format('YYYY-MM-DD'));
  }

  let promises = [];
  for(let i= 0;i < lastNoDays.length; i++) {
    let converterURL = `${environment.EXTERNAL_INTERACTION_BASE_URL}historical?access_key=${API_ACCESS_KEY}&date=${lastNoDays[i]}&currencies=${params.currencies}`;
    const method = "GET";
    let options = {
      url: converterURL,
      method
    };
    promises.push(
      axios(options)
      .then(res=>{
        let response = res.data;
        historicalDataRates.push({"date": response.date, "rates": response.quotes});
      }).catch(err=>{
        historicalDataCallback(null, err);
      })
    );
    
  }

  Promise.all(promises).then(() => historicalDataCallback(null, historicalDataRates));
};
