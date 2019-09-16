const KeyValueStore = require('../../core/strategies/key-value-store');
module.exports = init => KeyValueStore(new Map(init));