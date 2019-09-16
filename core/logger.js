const {now} = require('./time');

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

const log = (prefix, message, {timestamp_color = color.text.blue, prefix_color = color.text.magenta, text_color = color.text.white, log_type = 'log' }) =>
    console[log_type](timestamp_color, now(), prefix_color, prefix, text_color, ...message, color.normal);

exports.db = (...message) =>
    log('DB', message, {prefix_color: color.text.green });
exports.trace = (...message) =>
    log('TRACE', message, {prefix_color: color.background.white});
exports.alert = (...message) =>
    log('ALERT', message, {prefix_color: color.text.yellow, timestamp_color: color.text.green});
exports.error = (...message) => 
    log('ERROR', message, {prefix_color: color.background.red, timestamp_color: color.text.red});
exports.dbError = (...message) =>
    log('DB-ERROR', ...message, {prefix_color: color.background.red, timestamp_color: color.text.green});