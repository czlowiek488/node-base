const { bash } = require('../core/executor');

const cleanup = (result) => result
  .replace(/\n/g, ' ')
  .replace(/ \f/g, '')
  .replace(/\f/g, '');

exports.read = ({ path, oem, psm, dpi, whitelist, pattern }) =>
  bash(`tesseract ${path} stdout --oem ${oem} --psm ${psm} -c tessedit_char_whitelist=${whitelist} --dpi ${dpi}  ${pattern !== undefined ? `--user-patterns ${pattern}` : ''}`, '/')
    .then(cleanup);
