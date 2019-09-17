const MicroService = require('../strategies/micro-service');
const { error } = require('../../core/logger');
const errorHandler = err => error(err) || ({ success: false });
module.exports = MessageBroker => MicroService({ MessageBroker, errorHandler })