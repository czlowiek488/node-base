exports.config = {
  extension_white_list: ['sfdt', 'png', 'jpeg', 'jpg', 'xls', 'docx', 'doc', 'txt', 'xlsx', 'ppt', 'pptx', 'odt', 'pdf'],
  encoding: {
    utf8: ['txt', 'sfdt'],
    binary: ['png', 'jpeg', 'jpg', 'xls', 'docx', 'doc', 'xlsx', 'ppt', 'pptx', 'odt', 'pdf'],
  },
  images: ['jpg', 'jpeg', 'png', 'bmp', 'gif'],
  sizes: [5000, 1500, 800],
  default_size: 800,
};

exports.updateConfig = (custom_config) => {
  exports.config = { ...this.config, ...custom_config };
};

exports.isInWhiteList = (extension, additional_extensions) => {
  if ([...this.config.extension_white_list, ...additional_extensions].includes(extension) === false) throw Error('File extension is not on white_list!');
};
exports.isImage = extension =>
  this.config.images.includes(extension);
exports.handleSize = (options, size) =>
  ({ ...options, name: `${options.name}_${this.config.sizes.find(el => el === size) || this.config.default_size}` });

exports.getEncoding = extension =>
  new Promise((resolve, reject) => {
    Object.entries(this.config.encoding)
      .forEach(([encoding_name, encoding_extensions]) => encoding_extensions.includes(extension) && resolve(encoding_name));
    reject(Error('Unrecognized encoding!'));
  });
