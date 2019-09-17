const { now } = require('./time');
const { inspect } = require('util');

const color = {
    normal: '\x1b[0m',
    text: {
        red: '\x1b[31m',
        cyan: '\x1b[36m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        white: '\x1b[37m',
    },
    background: {
        white: '\x1b[47m',
        cyan: '\x1b[46m',
        red: '\x1b[41m',
    }
}

const createLogger = (prefix, { timestamp_color = color.text.blue, prefix_color = color.text.magenta, text_color = color.text.white, log_type = 'log' }) =>
    (...message) => console[log_type](`${timestamp_color}${now()}${prefix_color}|${prefix.slice(0, 10).padEnd(10, ' ')}->${text_color}`, ...message, color.normal);

exports.trace = createLogger('TRACE', { log_type: 'trace', prefix_color: color.background.white });
exports.inspect = (message, config) => createLogger('INSPECT', { text_color: color.text.cyan })(inspect(message, config));

exports.db = createLogger('DB', { prefix_color: color.text.green });
exports.debug = createLogger('DEBUG', { prefix_color: color.text.magenta })
exports.alert = createLogger('ALERT', { prefix_color: color.text.yellow, timestamp_color: color.text.green });
exports.error = createLogger('ERROR', { prefix_color: color.background.red, timestamp_color: color.text.red });
exports.dbError = createLogger('DB-ERROR', { prefix_color: color.background.red, timestamp_color: color.text.green });
exports.driver = createLogger('DRIVER', { prefix_color: color.text.yellow, timestamp_color: color.text.yellow });
