const MicroService = require('../../driver/strategies/micro-service');
const nats = require('../../driver/message-broker/json-nats');
const baseModel = require('../../driver/strategies/model');
const logger = require('../../core/logger');

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));
const messageBroker = nats({ logging: true });

const model = () => ({
    async write({ number, corresponder_name }) {
        await sleep(1000);
        logger.debug(corresponder_name, number);
        messageBroker.publish(corresponder_name, { endpoint: 'write', data: { number: number + 1, corresponder_name: this.name } });
        if (number >= 10) process.exit();
    },
});

const model1 = baseModel(model(), { name: 'Test.1' });
const model2 = baseModel(model(), { name: 'Test.2' });
model1.on('run', () => model1.write({ number: 0, corresponder_name: 'Test.1' }));

MicroService({ messageBroker, model: model1 })
MicroService({ messageBroker, model: model2 })