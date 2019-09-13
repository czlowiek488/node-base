const { createReadStream, createWriteStream, unlink, readFile, mkdir, existsSync, rename, writeFile } = require('fs');
const { normalize, format, parse } = require('path');

exports.objectToPath = ({ dir, name, ext, base }, with_extension) => {
  const path = format({ dir, name, ext: with_extension && ext ? `.${ext}` : '', base });
  return normalize(path);
};
exports.objectToDirPath = ({ dir, root }) =>
  this.objectToPath({ dir, root });
exports.pathToObject = path =>
  parse(normalize(path));
exports.copy = (source_path, target_path) =>
  new Promise((resolve, reject) => {
    const readStream = createReadStream(source_path);
    const writeStream = createWriteStream(target_path);
    writeStream.on('error', reject);
    readStream.on('error', reject);
    readStream.on('close', () => resolve);
    readStream.pipe(writeStream);
  });
exports.remove = path =>
  new Promise((resolve, reject) => {
    unlink(path, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
exports.move = (source_path, target_path) =>
  new Promise((resolve, reject) => {
    rename(source_path, target_path, async (err) => {
      if (err === undefined || err === null) return resolve();
      if (err.code === 'EXDEV') {
        await this.copy(source_path, target_path);
        await this.remove(source_path);
        resolve();
      }
      return reject(err);
    });
  });
exports.get = (source_path, encoding) =>
  new Promise((resolve, reject) => {
    readFile(source_path, encoding, (err, buffer) => {
      if (err) reject(err);
      resolve(buffer);
    });
  });
exports.createDir = (path, recursive = false) =>
  new Promise((resolve, reject) => {
    mkdir(path, { recursive }, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
exports.checkDir = path =>
  Promise.resolve(existsSync(path));
exports.upsert = (path, content, encoding) =>
  new Promise((resolve, reject) => {
    writeFile(path, content, encoding, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
