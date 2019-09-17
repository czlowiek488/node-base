const BaseService = require('./base');
module.exports = ({ MessageBroker, config }) => BaseService(MessageBroker)({ family: 'INTERNAL', ...config });