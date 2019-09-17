module.exports = logic => {
    if (!(logic instanceof Object && logic.constructor.name === 'Object' && logic !== null)) {
        throw Error(`MODEL INITALIZATION FAILED!`)
    }
    return Object.freeze(logic);
}