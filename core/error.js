const { now } = require('./time');
const { inspect } = require('util');
const logger = require('../core/logger');
const BaseError = (name, message, data) => {
    logger.error('\n', name, `\n*${name.replace(/./g, '*')}*\n`, inspect({ timestamp: now(), message, data }, { breakLength: 10 }));
    const newError = Error();
    newError.name = name;
    return newError;
}
exports.driverError = (creator, message, data) =>
    BaseError(`DRIVER-${creator}`, message, data);
exports.typeError = (creator, message, data) =>
    BaseError(`VALIDATOR-${creator}`, message, data);
exports.apiError = (creator, message, data) =>
    BaseError(`API-${creator}`, message, data)