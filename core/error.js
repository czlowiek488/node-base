const { now } = require('./time');
const BaseError = (name, message, data) => {
    const newError = Error(JSON.stringify({ timestamp: now(), message, data }));
    newError.name = name;
    return newError;
}
exports.driverError = (creator, message, data) =>
    BaseError(`DRIVER-${creator}`, message, data);
exports.typeError = (creator, message, data) =>
    BaseError(`VALIDATOR-${creator}`, message, data);
exports.apiError = (creator, message, data) =>
    BaseError(`API-${creator}`, message, data)