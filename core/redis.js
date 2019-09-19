const redis = require('redis');
const { driverError } = require('../core/error');
const os_type = require('os').type();
if (os_type !== 'Linux') {
    driverError('KeyValueStore:Redis', 'clientError - redis client can only be used on Linux OS!', { os_type })
    process.exit(1);
}
module.exports = ({ config = undefined }) => {
    const client = redis.createClient(config);
    client.on('error', e => driverError('KeyValueStore:Redis', 'clientError', e));
    const accessable = {
        get(key) { return new Promise((resolve, reject) => client.get(key, (err, value) => err === null ? resolve(value) : reject(err))) },
        set(key, value) { return new Promise((resolve, reject) => client.set(key, value, err => err === null ? resolve() : reject(err))) },
        setex(key, value, time) { return new Promise((resolve, reject) => client.set(key, value, 'EX', time, err => err === null ? resolve() : reject(err))) },
        delete(key) { return new Promise((resolve, reject) => client.del(key, (err, value) => err === null ? resolve(value) : reject())) },
    };
    return Object.freeze(accessable);
}