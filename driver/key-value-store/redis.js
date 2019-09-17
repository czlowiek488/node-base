const KeyValueStore = require('../strategies/key-value-store');
const Redis = require('../../core/redis');
const { error } = require('../../core/logger');

const RedisStore = Redis({ errorHandler: error });
module.exports = () => KeyValueStore(RedisStore);