const BaseService = require('./base');
module.exports = ({ MessageBroker, config }) => BaseService(MessageBroker)({ family: 'API', ...config });