const { now } = require('./time');
const BaseError = (name, message) => {
    const newError = Error(JSON.stringify({ timestamp: now(), message }));
    newError.name = name;
    return newError;
}
exports.driverError = ({ driver, message }) =>
    BaseError(`DRIVER-${driver}`, message);