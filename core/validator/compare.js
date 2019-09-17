const { isObject, isArray } = require('./basic')
exports.onKeys = (object, method, keys, comparator) => {
    const result = keys[method](key => comparator(object[key]));
    return result === true
        ? result
        : keys
            .filter(key => comparator(object[key]))
            .map(key => isObject(object[key])
                ? { validator: 'onKeys', key, type: typeof object[key], instance: object[key].constructor.name }
                : { validator: 'onKeys', key, type: typeof object[key] });

};
exports.many = tests => {
    if (!isArray(tests)) throw Error('core/validator/compare.many, tests must be array')
    const result = tests.filter(test => test !== true)
    return result.length !== 0
        ? result
        : true;
};
exports.basic = (checker, value, is_positiv = true) => {
    const result = is_positiv ? checker(value) : !checker(value);
    return result === true
        ? result
        : { validator: 'basic', checker: checker.name, type: typeof value };
};