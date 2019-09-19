const uWS = require('uWebSockets.js');
const Server = require('../../driver/strategies/server');
const { apiError } = require('../../core/error');
module.exports = ({
    ssl_key_abs_path,
    ssl_cert_abs_path,
    max_payload_bytes = 16 * 1024 * 1024,
    idle_connection_timeout_seconds = 60 * 15
}) => {
    const server = uWS.App({
        key_file_name: ssl_key_abs_path,
        cert_file_name: ssl_cert_abs_path,
    });
    const accessable = {
        ws(emit) {
            server.ws('/*', {
                maxPayloadLength: max_payload_bytes,
                idleTimeout: idle_connection_timeout_seconds,
                compression: 1,
                close: (ws, code, message) => emit('ws-close', ws, { message, code }),
                open: (ws, req) => emit('ws-open', ws, req),
                message: (ws, message, is_binary) => emit('ws-message', ws, { message: String.fromCharCode.apply(null, new Uint8Array(message)), is_binary }),
            });
        },
        rest(emit) {
            server.post('/*', (res, req) => emit('rest-message', res, req))
        },
        listen(port, emit) {
            server.listen(port, token => {
                if (!!token) {
                    emit('listen', { port, token });
                } else {
                    throw apiError(`Server:uWS:${port}`, `Listening Failed!`, { token })
                }
            });
        }
    };
    return Server(accessable, { is_websocket: true, is_rest: true });
};