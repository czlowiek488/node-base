const Redis = require('../../driver/key-value-store/redis');
const Map = require('../../driver/key-value-store/map');
const logger = require('../../core/logger');

const Store2 = Redis();
const Store1 = Map();

const test = async (func, ...args) => {
    try { await func(...args).then(res => logger.debug('OK', { func, args })) }
    catch (e) { logger.error('FAILED', { func, args }, e) }
}

(async () => {
    try {
        await test(Store1.set, 1, 'a');
        await test(Store1.get, 1);
        await test(Store2.set, 2, 'a');
        await test(Store1.get, 2);
        logger.debug('DONE!');
        process.exit();
    } catch (e) {
        logger.error(e);
    }
})();