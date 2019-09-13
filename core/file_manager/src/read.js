const { objectToPath, get } = require('../../file-promise');
const { binaryToBase64, getMimeAndExtension } = require('./converter');
exports.common = require('./common');


const getBinary = (path, encoding) =>
  get(path, encoding)
    .then(binaryToBase64);

const getUtf8 = (path, encoding) =>
  get(path, encoding);

module.exports = async (options, with_extension, size, additional_extensions) => {
  let path = objectToPath(options, with_extension);
  if (options.ext === undefined) {
    const { ext } = getMimeAndExtension(path);
    options.ext = ext;
  }
  this.common.isInWhiteList(options.ext, additional_extensions);
  const encoding = await this.common.getEncoding(options.ext);
  if (!!this.common.isImage(options.ext)) options = this.common.handleSize(options, size);
  path = objectToPath(options, with_extension);
  switch (encoding) {
    case 'binary': return getBinary(path, encoding);
    case 'utf8': return getUtf8(path, encoding);
    default: throw Error('Unsupported encoding!');
  }
};
