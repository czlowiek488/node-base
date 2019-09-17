const MicroService = require('../strategies/micro-service');
const MessageBroker = require('../broker/nats');
const { error } = require('../../core/logger');
const errorHandler = err => error(err) || ({ success: false });
module.exports = MicroService({ MessageBroker, errorHandler })