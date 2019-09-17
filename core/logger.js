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

const log = (prefix, { deep = false, timestamp_color = color.text.blue, prefix_color = color.text.magenta, text_color = color.text.white, log_type = 'log' }) =>
    (...message) => console[log_type](timestamp_color, now(), prefix_color, prefix, text_color, ...message, color.normal);

exports.trace = log('TRACE', { log_type: 'trace', prefix_color: color.background.white });
exports.inspect = log('INSPECT', { deep: true, text_color: color.text.cyan });

exports.db = log('DB', { prefix_color: color.text.green });
exports.debug = log('DEBUG', { prefix_color: color.text.magenta })
exports.alert = log('ALERT', { prefix_color: color.text.yellow, timestamp_color: color.text.green });
exports.error = log('ERROR', { prefix_color: color.background.red, timestamp_color: color.text.red });
exports.dbError = log('DB-ERROR', { prefix_color: color.background.red, timestamp_color: color.text.green });
exports.driver = log('DRIVER', { prefix_color: color.text.yellow, timestamp_color: color.text.yellow });