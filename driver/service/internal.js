const BaseService = require('./base');
const { debug } = require('../../core/logger');
module.exports = BaseService({ log: debug, family: 'INTERNAL' });