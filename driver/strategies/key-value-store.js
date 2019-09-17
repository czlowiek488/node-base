const { compare, basic: { isFunction } } = require('../../core/validator');

const fake_setex = store => async (key, value, time) => {
    await store.set(key, value);
    setTimeout(() => store.delete(key), time);
};

module.exports = (store) => {
    const compare_result = compare.onKeys(broker, 'some', ['get', 'set', 'delete'], isFunction);
    if (compare_result !== true) {
        throw Error(`KEY-VALUE-STORE INITIALIZATION FAILED! - ${JSON.stringify(compare_result)}`);
    }
    if (!isFunction(store['setex'])) {
        store['setex'] = fake_setex(store);
    }
    const accessable = {
        get(key) { return store.get(key) },
        set(key, value) { return store.set(key, value) },
        delete(key) { return store.delete(key, value) },
        setex(key, value, time) { return store.setex(key, value, time) },
    };
    return Object.freeze(accessable);
};