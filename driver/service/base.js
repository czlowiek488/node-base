const MicroService = require('../../core/strategies/micro-service');
const MessageBroker = require('../broker/nats');
const { error } = require('../../core/logger');
module.exports = MicroService({ MessageBroker, errorHandler: err => error(err) || ({ success: false }) })