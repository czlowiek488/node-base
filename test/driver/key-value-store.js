const Redis = require('../../driver/key-value-store/redis');
const Map = require('../../driver/key-value-store/map');

const Store2 = Redis();
const Store1 = Map();

const test = async (func, ...args) => {
    try { await func(...args).then(res => console.log('OK', { func, args })) }
    catch (e) { console.trace('FAILED', { func, args }) }
}

(async () => {
    try {
        await test(Store1.set, 1, 'a');
        await test(Store1.get, 1);
        await test(Store2.set, 2, 'a');
        await test(Store1.get, 2);
        console.log('DONE!');
        process.exit();
    } catch (e) {
        console.trace(e);
    }
})();