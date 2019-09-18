const MicroService = require('../../driver/strategies/micro-service');
const MessageBroker = require('../../driver/message-broker/json-nats')({ logging: true });
const Model = require('../../driver/strategies/model');
const uWS = require('../../driver/server/uWS');
const logger = require('../../core/logger');
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

const ApiModel = uWS({ port: 4100, websocket: true });

const ModelOne = ApiModel({
    count: async ({ index }) => {
        await sleep(150);
        MessageBroker.publish('Test.2', { endpoint: 'log', data: { index: index + 1 } });
    },
    eventHandler: () => { },
    wsHandler: (event_name, res, req) => {
        if (event_name === 'ws-open') logger.debug({ via: req.getUrl() });
        logger.debug('api-event', event_name)
    },
    apiHandler: (event_name) => {
        logger.debug('api-event', event_name)
    }
}, { port: 4100, websocket: true })

const ModelTwo = Model({
    log: async ({ index }) => {
        logger.debug({ index });
        await sleep(150);
        MessageBroker.publish('Test.1', { endpoint: 'count', data: { index } });
    },
    eventHandler: () => { }
});
const errorHandler = error => logger.debug({ error }) || ({ error });
MicroService({ MessageBroker, errorHandler, family: 'Test', name: '1', model: ModelOne });
MicroService({ MessageBroker, errorHandler, family: 'Test', name: '2', model: ModelTwo });
MessageBroker.publish('Test.1', { endpoint: 'count', data: { index: 0 } });