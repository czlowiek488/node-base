exports.common = require('./common');
const { createDir, move, checkDir, objectToPath, objectToDirPath, upsert } = require('../../file-promise');
const { resizeAndStoreImage, getMimeAndExtension } = require('./converter');

const handleDir = async (target_options) => {
  const dir_path = await objectToDirPath(target_options);
  const dir_exists = await checkDir(dir_path);
  if (!dir_exists) await createDir(dir_path, true);
};

const saveImageUsingManySizes = async (source_path, options, with_extension) => {
  for await (const size of this.common.config.sizes) { // this 'for await' is preventing reading file by too many streams at once
    const path = objectToPath({ ...options, name: `${options.name}_${size}` }, with_extension);
    await resizeAndStoreImage(source_path, path, size);
  }
};

const handleContentSave = async (content, target_options, with_extension, additional_allowed_extensions) => {
  const encoding = this.common.getEncoding(target_options.ext);
  this.common.isInWhiteList(target_options.ext, additional_allowed_extensions);
  const is_image = this.common.isImage(target_options.ext);
  await handleDir(target_options);
  const path = objectToPath(target_options, with_extension);
  await upsert(path, content, encoding);
  if (is_image) await saveImageUsingManySizes(path, path, with_extension);
};

module.exports = async ({ source_path, file_content }, target_options, with_extension, additional_allowed_extensions) => {
  if (target_options.ext === undefined) {
    const { ext } = getMimeAndExtension(source_path);
    target_options.ext = ext;
  }
  if (file_content !== undefined) return handleContentSave(file_content, target_options, with_extension, additional_allowed_extensions);
  this.common.isInWhiteList(target_options.ext, additional_allowed_extensions);
  await handleDir(target_options);
  const path = objectToPath(target_options, with_extension);
  if (!!this.common.isImage(target_options.ext)) await saveImageUsingManySizes(source_path, target_options, with_extension);
  else await move(source_path, path);
  return target_options;
};
