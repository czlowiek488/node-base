const Compare = require('../../core/validator/compare');

const fake_setex = store => async (key, value, time) => {
    await store.set(key, value);
    setTimeout(() => store.delete(key), time);
};

module.exports = (store) => {
    const compare_result = Compare.onKeys(broker, 'some', ['get', 'set', 'delete'], value => !(value instanceof Function));
    if (compare_result !== true) {
        throw Error(`KEY-VALUE-STORE INITIALIZATION FAILED! - ${compare_result}`);
    }
    if (!(store['setex'] instanceof Function)) {
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