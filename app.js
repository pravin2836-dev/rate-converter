// Module Imports
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const routes = require('./src/routes');
const morgan = require('morgan');
const args = require('minimist')(process.argv);
const sqlOrCssInjection = require('./src/custom_modules/sql_injection_module/sqlOrCssInjection');
const rateConverterValidation = require('./src/services/validations/rateConverterValidation');
const logger = require('./src/custom_modules/logger_module/WinstonHelper');
const cors = require('cors');

// Middleware Configuration
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(sqlOrCssInjection);
app.use(
    morgan(function (tokens, req, res) {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens['response-time'](req, res), 'ms',
        ].join(' ')
    }, {
        stream: logger.stream,
    })
);

app.use(router);
Error.prototype.stack = '';
app.set("port", args.p);
app.use(function error_handler(err, req, res, next) {
    res.header("Content-Type", "application/json; charset=utf-8");
    res.status(err.code || 500).send(
        JSON.stringify(err, undefined, 2));
});


// Routes
router.get('/v1.0/inr-usd', rateConverterValidation.rateConverterValidation, routes.rateConverter);
router.get('/v1.0/historical-data', rateConverterValidation.historicalDataValidation, routes.historicalData);

// Starting server
app.listen(app.get("port"), () => {
    logger.info("Express server for rate-converter : started on port " + app.get("port"))
    console.log("info", "Express server for rate-converter : started on port : " + app.get("port"));
})

module.exports = app;
