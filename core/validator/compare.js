require('../env');
const { isObject, isArray, isFunction, isString } = require('./basic')
const { typeError } = require('../error');

const productionValidators = {
    onKeys(object, method, keys, comparator) {
        const result = keys[method](key => comparator(object[key]));
        return result === true
            ? result
            : keys
                .filter(key => comparator(object[key]))
                .map(key => isObject(object[key])
                    ? { validator: 'onKeys', key, type: typeof object[key], instance: object[key].constructor.name, data: object[key] }
                    : { validator: 'onKeys', key, type: typeof object[key], data: object[key] });
    },
    many(tests) {
        const result = tests.filter(test => test !== true)
        return result.length !== 0
            ? new Map(Object.entries(tests))
            : true;
    },
    basic(checker, value, is_positiv = true) {
        const result = is_positiv ? checker(value) : !checker(value);
        return result === true
            ? result
            : { validator: 'basic', checker: checker.name, type: typeof value, value };
    },
};

const developmentValidators = {
    onKeys(object, method, keys, comparator) {
        const compare_result = productionValidators.many([
            productionValidators.basic(isObject, object),
            productionValidators.basic(isString, method),
            productionValidators.basic(isArray, keys),
            productionValidators.basic(isFunction, comparator),
        ]);
        if (compare_result !== true) {
            throw typeError('Compare', `Argument validation failed!`, compare_result);
        }
        return productionValidators.onKeys(object, method, keys, comparator);

    },
    many(tests) {
        const compare_result = productionValidators.basic(isArray, tests);
        if (compare_result !== true) {
            throw typeError('Compare', `Argument validation failed!`, compare_result);
        }
        return productionValidators.many(tests);
    },
    basic(checker, value, is_positiv = true) {
        const compare_result = productionValidators.basic(isFunction, checker);
        if (compare_result !== true) {
            throw typeError('Compare', `Argument validation failed!`, compare_result);
        }
        return productionValidators.basic(checker, value, is_positiv);
    },
};
module.exports = process.env.APP_ENV === 'dev'
    ? developmentValidators
    : productionValidators;