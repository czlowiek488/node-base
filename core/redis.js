const redis = require('redis');
module.exports = ({ config = undefined, errorHandler }) => {
    const client = redis.createClient(config);
    client.on('error', errorHandler);
    const accessable = {
        get(key) { return new Promise((resolve, reject) => client.get(key, (err, value) => err === undefined ? resolve(JSON.parse(value)) : reject(err))) },
        set(key, value) { return new Promise((resolve, reject) => client.set(key, JSON.stringify(value), err => err === undefined ? resolve() : reject(err))) },
        setex(key, value, time) { return new Promise((resolve, reject) => client.set(key, JSON.stringify(value), 'EX', time, err => err === undefined ? resolve() : reject(err))) },
        delete(key) { return new Promise((resolve, reject) => client.del(key, (err, value) => err === undefined ? resolve(JSON.stringify(value)) : reject())) },
    };
    return Object.freeze(accessable);
}