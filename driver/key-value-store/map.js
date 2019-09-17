const KeyValueStore = require('../strategies/key-value-store');
module.exports = init => KeyValueStore(new Map(init));