const MicroService = require('../../driver/strategies/micro-service');
const nats = require('../../driver/message-broker/json-nats');
const baseModel = require('../../driver/strategies/model');
const logger = require('../../core/logger');
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));
const messageBroker = nats({ logging: true });

const test = () => {
    const private = {
        id: null,
    };
    const accessable = {
        eventHandler(event_name, { service_id }) {
            if (event_name === 'starting') private.id = service_id;
        },
        start({ receiver_id }) {
            this.write({ number: 0, receiver_id });
        },
        async write({ number, receiver_id }) {
            await sleep(1000);
            logger.debug(receiver_id, number);
            messageBroker.publish(receiver_id, { endpoint: 'write', data: { number: number + 1, receiver_id: private.id } });
            if (number >= 10) process.exit();
        },
    };
    return Object.freeze(accessable);
};
MicroService({
    family: 'Test', name: '1', messageBroker,
    model: baseModel(test())
});
MicroService({
    family: 'Test', name: '2', messageBroker,
    model: baseModel(test())
});

messageBroker.publish('Test.2', { endpoint: 'start', data: { receiver_id: 'Test.1' } });