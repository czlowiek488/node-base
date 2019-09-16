module.exports = (store = new Map()) => {
    if(store['get'] === undefined 
        || store['set'] === undefined
        || store['delete'] === undefined) throw Error('KV-STORE INITIALIZATION FAILED!');
    const fake_setex = (key, value, time) => {
        store.set(key, value);
        setTimeout(() => store.delete(key), time);
    }
    const accessable = {
        get(key){ return store.get(key) },
        set(key, value) { return store.set(key, value) },
        delete(key) { return store.delete(key, value) },
        setex(key, value, time) { 
            return store[setex] === undefined
                ? fake_setex(key, value, time)
                : store.setex(key, value, time)
        },
    };
    return Object.freeze(accessable);
} 
