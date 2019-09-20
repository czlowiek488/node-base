const MicroService = require('../../driver/strategies/micro-service');
const nats = require('../../driver/message-broker/json-nats');
const uWS = require('../../driver/server/uWS');
const logger = require('../../core/logger');
//TODO add websocket client here
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

const messageBroker = nats({ logging: true });
const serverModel = uWS({
    ssl_key_abs_path: '/mnt/c/workspace/_SSL/key.pem',
    ssl_cert_abs_path: '/mnt/c/workspace/_SSL/cert.pem',
});

const model = serverModel(
    {
        async ping(ws) {
            await sleep(1000);
            logger.debug('PING')
            this.emit('ws-send', ws, { message: 'PING' })
        }
    },
    {
        name: 'Server.WS',
        port: 4100,
        websocket: true,
    }
);
model.on('ws-open', ws => model.ping(ws));
model.on('ws-message', async (ws, { message }) => {
    if (message === 'PONG') {
        logger.debug({ message });
        model.ping(ws);
    }
});

MicroService({ messageBroker, model });