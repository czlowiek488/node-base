exports.isIstance = (value, instance) => value instanceof instance;
exports.isFunction = value => this.isIstance(value, Function);
exports.isObject = value => this.isIstance(value, Object) && value !== null;
exports.isArray = value => this.isIstance(value, Array);

exports.isPrimitiv = (value, primitiv_type) => typeof value === primitiv_type;
exports.isString = value => this.isPrimitiv(value, 'string');

exports.isEqual = (value1, value2) => value1 === value2;
exports.isNull = value => this.isEqual(value, null)
exports.isUndefined = value => this.isEqual(value, undefined);