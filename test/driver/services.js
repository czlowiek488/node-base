const MicroService = require('../../driver/strategies/micro-service');
const MessageBroker = require('../../driver/message-broker/json-nats')();
const Model = require('../../driver/strategies/model');
const ApiModel = require('../../src/base-model/api');
const logger = require('../../core/logger');
const ModelOne = ({
    start: async ({ index }) => {
        const { index: new_index } = await MessageBroker.request('Test.2', { endpoint: 'test', data: { index } });
        return { index: new_index + 1 };
    },
    eventHandler: () => { },
    apiHandler: (event_name, res, req) => {
        if (event_name === 'ws-open') logger.debug({ via: req.getUrl() });
        logger.debug('api-event', event_name)
    }
})

const ModelTwo = ({
    test: async ({ index }) => {
        return { index: index + 1 };
    },
    eventHandler: () => { }
});

const errorHandler = error => logger.debug({ error }) || ({ error });
MicroService({ MessageBroker, errorHandler, family: 'Test', name: '1', model: ApiModel(ModelOne, { port: 4100, websocket: true }) });
MicroService({ MessageBroker, errorHandler, family: 'Test', name: '2', model: Model(ModelTwo) });
MessageBroker.request('Test.1', { endpoint: 'start', data: { index: 0 } }).then(logger.debug)