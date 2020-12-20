const args = require('minimist')(process.argv);
const config = require('./config')

const environment = Object.freeze(config[args.e]);

module.exports = {
    environment
}
