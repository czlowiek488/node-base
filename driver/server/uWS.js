const uWS = require('uWebSockets.js');
const Server = require('../../driver/strategies/server');
const logger = require('../../core/logger');
const { apiError } = require('../../core/error');
const arrBuff2Str = arrBuff => String.fromCharCode.apply(null, arrBuff)
module.exports = ({
    ssl_key_abs_path,
    ssl_cert_abs_path,
    json = true,
    binary = false,
    max_payload_bytes = 16 * 1024 * 1024,
    idle_connection_timeout_seconds = 60 * 15
}) => {
    const server = uWS.App({
        key_file_name: ssl_key_abs_path,
        cert_file_name: ssl_cert_abs_path,
    });
    const state = {
        port: null,
    };
    const read_json = {
        ws: (ws, message) => {
            const arrBuff = new Uint8Array(message);
            if (!!binary) return arrBuff;
            const string = arrBuff2Str(arrBuff);
            if (!json) return string;
            try { return JSON.parse(string) }
            catch { logger.error(`Server:uWS:${state.port}`, 'WS message JSON serialization Failed', { string, from: arrBuff2Str(ws.getRemoteAddress()) }) }
        },
        post: (req, res) => {
            let buffer;
            const end = buff => {
                try {
                    if (!!binary) return buff;
                    if (!json) return buff.toString();
                    return JSON.parse(buff);
                } catch {
                    res.close();
                    logger.error(`Server:uWS:${state.port}`, 'Rest Message JSON serialization failed!', { req, res, e });
                }
            };
            res.onData((message, is_last) => {
                const chunk = Buffer.from(message);
                if (is_last) {
                    if (buffer) { end(Buffer.concat([buffer, chunk])) }
                    else { end(chunk) }
                } else {
                    buffer = Buffer.concat(buffer ? [buffer, chunk] : [chunk]);
                }
            });
        }
    };
    const accessable = {
        ws(emit, on) {
            on('ws-send', (ws, message) => {
                try { message = !!json ? JSON.stringify(message) : message }
                catch { logger.error(`Server:uWS:${state.port}`, 'WS Send JSON serialization failed!', message) }
                try { ws.send(message) }
                catch (e) { logger.error(`Server:uWS:${state.port}`, 'WS Send message sending failed!', message, e) }
            })
            server.ws('/*', {
                maxPayloadLength: max_payload_bytes,
                idleTimeout: idle_connection_timeout_seconds,
                compression: 1,
                close: (ws, code, message) => emit('ws-close', ws, { message, code }),
                open: (ws, req) => emit('ws-open', ws, req),
                message: (ws, message, is_binary) => emit('ws-message', ws, read_json.ws(ws, message)),
            });
        },
        rest(emit) {
            server.post('/*', (res, req) =>
                read_json.post(res, json =>
                    emit('rest-message', res, req, json)
                ))
        },
        listen(port, emit) {
            server.listen(port, token => {
                if (!!token) {
                    state.port = port;
                    emit('listen', { port, token });
                } else {
                    throw apiError(`Server:uWS:${port}`, `Listening Failed!`, { token })
                }
            });
        }
    };
    return Server(accessable, { is_websocket: true, is_rest: true });
};