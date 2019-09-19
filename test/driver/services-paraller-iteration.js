const MicroService = require('../../driver/strategies/micro-service');
const nats = require('../../driver/message-broker/json-nats');
const baseModel = require('../../driver/strategies/model');
const logger = require('../../core/logger');
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));
const messageBroker = nats({ logging: true });

const testService = service_id =>
    MicroService({
        service_id, messageBroker,
        model: baseModel({
            eventHandler() { },
            start({ receiver_id }) {
                this.write({ number: 0, receiver_id });
            },
            async write({ number, receiver_id }) {
                await sleep(1000);
                logger.debug(receiver_id, number);
                messageBroker.publish(receiver_id, { endpoint: 'write', data: { number: number + 1, receiver_id: service_id } });
                if (number >= 10) process.exit();
            },
        })
    });

testService('Test.1');
testService('Test.2');

messageBroker.publish('Test.2', { endpoint: 'start', data: { receiver_id: 'Test.1' } });