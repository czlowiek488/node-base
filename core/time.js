exports.moment = require('moment');

exports.now = () => this.moment().format('YY/MM/DD hh:mm:ss');
exports.ms = () => this.moment().valueOf();
exports.nano = () => process.hrtime().join('');
