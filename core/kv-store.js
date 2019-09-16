module.exports = (store = new Map()) => {
    if(!(store['get'] instanceof Funtion && store['set'] instanceof Funtion && store['delete'] instanceof Funtion)) {
        throw Error(`KV-STORE INITIALIZATION FAILED! - ${JSON.stringify({get: store.get, set: store.set, delete: store.delete, setex: store.setex})}`);
    }
    const fake_setex = (key, value, time) => {
        store.set(key, value);
        setTimeout(() => store.delete(key), time);
    }
    const accessable = {
        get(key){ return store.get(key) },
        set(key, value) { return store.set(key, value) },
        delete(key) { return store.delete(key, value) },
        setex(key, value, time) { 
            return store[setex] instanceof Funtion
                ? store.setex(key, value, time)
                : fake_setex(key, value, time)
        },
    };
    return Object.freeze(accessable);
} 
