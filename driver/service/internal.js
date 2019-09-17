const BaseService = require('./base');
const { debug } = require('../../core/logger');
module.exports = config => BaseService({ log: debug, family: 'INTERNAL', ...config });