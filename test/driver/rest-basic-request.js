const MicroService = require('../../driver/strategies/micro-service');
const nats = require('../../driver/message-broker/json-nats');
const uWS = require('../../driver/server/uWS');
const logger = require('../../core/logger');
const rp = require('request-promise');
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));
const messageBroker = nats({ logging: true });
const serverModel = uWS({
    ssl_key_abs_path: '/mnt/c/workspace/_SSL/key.pem',
    ssl_cert_abs_path: '/mnt/c/workspace/_SSL/cert.pem',
});



const model = serverModel(
    {},
    {
        name: 'Server.Rest',
        port: 4101,
        rest: true,
    }
);
model.on('rest-message', async (res, req, json) => {
    logger.debug('SERVER', { json });
    res.end('OK!');
});

MicroService({ messageBroker, model });
sleep(1000)
    .then(() => rp({ uri: 'http://localhost:4101', method: 'POST', json: true, body: { message: 'request-passed!' } })
        .then(resp => logger.debug('CLIENT', { resp }))
        .catch(e => logger.error('CLIENT', e)));