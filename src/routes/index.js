const rateConverterService = require('../services/rateConverterService');

exports.rateConverter = (req, res) => {
  rateConverterService.rateConverter(req.query, (err, response) => {
    if (err) {
      res.send((err.code ? err.code : 500), err);
    } else {
      res.send(200, response);
    }
  });
};

exports.historicalData = (req, res) => {
  rateConverterService.historicalData(req.query, (err, response) => {
    if (err) {
      res.send((err.code ? err.code : 500), err);
    } else {
      res.send(200, response);
    }
  });
};