const { compare, basic: { isObject, isFunction } } = require('../../core/validator');
module.exports = model => {
    const compare_result = compare.many([
        compare.onKeys(model, 'some', ['eventHandler'], isFunction),
        compare.basic(isObject, model)
    ]);
    if (compare_result !== true) {
        throw Error(`MICRO-SERVICE INITIALIZATION FAILED! ${JSON.stringify(compare_result)}`)
    }
    return Object.freeze(model);
}