exports.onKeys = (object, method, keys, comparator) => {
    const result = keys[method](key => comparator(object[key]));
    if (result !== true) return keys.filter(key => comparator(object[key])).map(key => typeof object[key] === 'object' ? { key, type: typeof object[key], instance: object[key].constructor.name } : { key, type: typeof object[key] });
    return true;
};
exports.many = (tests = []) => {
    const result = tests.filter(test => test !== true)
    return result.length !== 0
        ? result
        : true;
};