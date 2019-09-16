const write = require('./src/write');
const read = require('./src/read');

const generateFileOptions = ({ dir, filename, ext, size }) =>
  ({
    name: filename,
    dir,
    ext,
    size,
  });


exports.write = async ({ source_path, file_content, filename, ext, additional_extensions = [], dir }) => {
  const options = generateFileOptions({ dir, filename, ext });
  await write({ source_path, file_content }, options, true, additional_extensions);
  return options;
};

exports.read = async ({ filename, ext, size, additional_extensions = [], dir }) => {
  const options = generateFileOptions({ dir, filename, ext, size });
  const file = await read(options, true, size, additional_extensions);
  return { file, ...options };
};
