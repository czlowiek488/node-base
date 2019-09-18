const uWS = require('uWebSockets.js');
const Server = require('../../driver/strategies/server');
const { compare, basic: { isFunction } } = require('../../core/validator');
const { apiError } = require('../../core/error');
module.exports = () => {
    const server = uWS.App({});
    const accessable = {
        ws(wsHandler) {
            const compare_result = compare.basic(isFunction, wsHandler);
            if (compare_result !== true) {
                throw apiError(`uWS:${port}`, 'wsHandler is not function!', compare_result)
            }
            server.ws('/*', {
                maxPayloadLength: 1024,
                idleTimeout: 60 * 15,
                compression: 1,
                close: (ws, code, message) => wsHandler('ws-close', ws, { message, code }),
                open: (ws, req) => wsHandler('ws-open', ws, req),
                message: (ws, message, is_binary) => wsHandler('ws-message', ws, { message, is_binary }),
            });
        },
        rest(restHandler) {
            const compare_result = compare.basic(isFunction, restHandler);
            if (compare_result !== true) {
                throw apiError(`uWS:${port}`, 'restHandler is not function!', compare_result)
            }
            server.post('/*', (res, req) => restHandler('rest-message', res, req))
        },
        listen(port, apiHandler) {
            const compare_result = compare.basic(isFunction, apiHandler);
            if (!compare_result) {
                throw apiError(`uWS:${port}`, 'apiHandler is not defined!', compare_result)
            }
            server.listen(port, token => {
                if (!!token) {
                    apiHandler('listen');
                } else {
                    throw apiError(`uWS:${port}`, `Listening Failed!`, { token })
                }
            });
        }
    };
    return Server(accessable);
};