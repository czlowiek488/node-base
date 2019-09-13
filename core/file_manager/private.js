const read = require('./src/read');
const write = require('./src/write');

const storage = {
  counter: 0,
};

/* eslint no-plusplus: 0 */
const generateName = (id = storage.counter++) =>
  [id, (new Date()).getTime()].join('-');


const generateFileOptions = ({ dir, filename, ext }) =>
  ({
    name: filename,
    dir,
    ext,
  });
/**
 *
 */
exports.write = async ({ source_path, file_content, filename = generateName(), ext, additional_extensions = [], dir }) => {
  const options = generateFileOptions({ dir, filename, ext });
  const post_options = await write({ source_path, file_content }, options, false, additional_extensions);
  return { ...options, ...post_options };
};

exports.read = async ({ filename, ext, size, additional_extensions = [], dir }) => {
  const options = generateFileOptions({ dir, filename, ext });
  const file = await read(options, false, size, additional_extensions);
  return { file, ...options };
};
