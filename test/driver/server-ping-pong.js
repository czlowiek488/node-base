const MicroService = require('../../driver/strategies/micro-service');
const nats = require('../../driver/message-broker/json-nats');
const uWS = require('../../driver/server/uWS');
const logger = require('../../core/logger');
const messageBroker = nats({ logging: true });
const serverModel = uWS({
    ssl_key_abs_path: '/mnt/c/workspace/_SSL/key.pem',
    ssl_cert_abs_path: '/mnt/c/workspace/_SSL/cert.pem',
});

const test = {
    eventHandler() { },
    wsHandler: (event_name, ws, req) => {
        if (event_name === 'ws-open') {
            logger.debug({ via: req.getUrl() })
            ws.send('PING');
        };
        if (event_name === 'ws-message') {
            logger.debug({ req });
            ws.send('PING');
        }
        logger.debug('api-event', event_name);
    },
    apiHandler: (event_name) => {
        logger.debug('api-event', event_name);
    },
};

MicroService({
    service_id: 'Server.WS', messageBroker,
    model: serverModel(test, { port: 4100, websocket: true }),
});