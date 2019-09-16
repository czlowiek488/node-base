const sharp = require('sharp');
const fileType = require('file-type');
const readChunk = require('read-chunk');

const config = {
  minimalSize: 100,
};

exports.getMimeAndExtension = file_path =>
  fileType(readChunk.sync(file_path, 0, fileType.minimumBytes));

exports.binaryToBase64 = binary =>
  Buffer.from(binary, 'binary').toString('base64');

exports.resizeAndStoreImage = async (source_path, target_path, size) => {
  const image = await sharp(source_path);
  let { width, height } = await image.metadata();
  if (!width || width < config.minimalSize) throw Error('InvalidWidth');
  if (!height || height < config.minimalSize) throw Error('InvalidHeight');
  const multipler = Math.max(width, height) / size;
  if (multipler > 1) {
    width /= multipler;
    height /= multipler;
  }
  return image
    .resize(Math.round(width), Math.round(height), { withoutEnlargement: true })
    .toFile(target_path);
};
