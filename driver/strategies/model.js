const { compare, basic: { isFunction, isString } } = require('../../core/validator');
const { driverError } = require('../../core/error');
module.exports = (model, { name }) => {
    const events = {};
    const getEventListeners = event_name => events[event_name] || [];
    const emitEvent = (event_name, ...args) =>
        getEventListeners(event_name).forEach(event_executor => event_executor(...args));

    const model_extension = {
        get name() { return name },
        on(event_name, event_executor) {
            const compare_result = compare.many([
                compare.basic(isFunction, event_executor),
                compare.basic(isString, event_name),
            ]);
            if (compare_result !== true) {
                throw driverError(`Model:${name}`, 'event listener attachment failed!', compare_result);
            }
            events[event_name] = getEventListeners(event_name);
            events[event_name].push(event_executor);
        },
        emit(event_name, ...args) {
            emitEvent('any', event_name, ...args);
            emitEvent(event_name, ...args);
        }
    };
    const accessable = Object.assign(model, model_extension);
    return Object.freeze(accessable);
}