const { compare, basic: { isObject, isFunction } } = require('../../core/validator');
const { driverError } = require('../../core/error');
module.exports = model => {
    const compare_result = compare.many([
        compare.onKeys(model, 'some', ['eventHandler'], isFunction),
        compare.basic(isObject, model)
    ]);
    if (compare_result !== true) {
        throw driverError(`Model`, `Initalization failed!`, compare_result)
    }
    return Object.freeze(model);
}