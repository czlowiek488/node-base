const getPath = name => `${__dirname}/config/${name}`;
const requireUncached = path => {
    delete require.cache[require.resolve(path)];
    return require(path);
}
module.exports = (env = undefined) => {
    requireUncached('dotenv').config();
    const path = getPath(env || process.env.APP_ENV || 'dev');
    return requireUncached(path)
};
  