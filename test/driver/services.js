const MicroService = require('../../driver/strategies/micro-service');
const MessageBroker = require('../../driver/message-broker/json-nats')({ logging: true });
const Model = require('../../driver/strategies/model');
const ApiModel = require('../../src/base-model/api');
const logger = require('../../core/logger');
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));
const ModelOne = ({
    count: async ({ index }) => {
        await sleep(150);
        MessageBroker.publish('Test.2', { endpoint: 'log', data: { index: index + 1 } });
    },
    eventHandler: () => { },
    apiHandler: (event_name, res, req) => {
        if (event_name === 'ws-open') logger.debug({ via: req.getUrl() });
        logger.debug('api-event', event_name)
    }
})

const ModelTwo = ({
    log: async ({ index }) => {
        logger.debug({ index });
        await sleep(150);
        MessageBroker.publish('Test.1', { endpoint: 'count', data: { index } });
    },
    eventHandler: () => { }
});

const errorHandler = error => logger.debug({ error }) || ({ error });
MicroService({ MessageBroker, errorHandler, family: 'Test', name: '1', model: ApiModel(ModelOne, { port: 4100, websocket: true }) });
MicroService({ MessageBroker, errorHandler, family: 'Test', name: '2', model: Model(ModelTwo) });
MessageBroker.publish('Test.1', { endpoint: 'count', data: { index: 0 } });