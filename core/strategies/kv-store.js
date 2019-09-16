const fake_setex = store => async (key, value, time) => {
    await store.set(key, value); //make sure kv-pair is definedbefre delete event initaliziation
    setTimeout(() => store.delete(key), time);
};

module.exports = (store = new Map()) => {
    if (!(store['get'] instanceof Funtion && store['set'] instanceof Funtion && store['delete'] instanceof Funtion)) {
        throw Error(`KV-STORE INITIALIZATION FAILED! - ${JSON.stringify({ get: store.get, set: store.set, delete: store.delete, setex: store.setex, received: store })}`);
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