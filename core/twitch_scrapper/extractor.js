const {bash} = require('../core/executor');

module.exports = class Extractor {
    constructor({mask_path}) {
        this.mask_path = mask_path;
    }
    generateFileTranformation = chunks => [
        `${chunks.length}${chunks.map((el, index) => `[in${index + 1}]`).join('')}`,
        ...chunks.map(({x, y, width, height, contrast, gamma}, index) => `[in${index + 1}]eq=contrast=${contrast}:gamma=${gamma},crop=in_w*${width}:in_h*${height}:in_w*${x}:in_h*${y}[out${index + 1}]`),
    ].join(';');

    generateOutputs = chunks => chunks
        .map(({path}, index) =>  `-map '[out${index + 1}]' -vframes 1 -y ${path}`)
        .join(' ');
        //-map '[out1]' -vframes 1 -y ${leftStats} -map '[out2]' -vframes 1 -y ${rightStats} -map '[out3]' -vframes 1 -y ${leftScore} -map '[out4]' -vframes 1 -y ${rightScore}  -map '[out5]' -vframes 1 -y ${leftCreeps} -map '[out6]' -vframes 1 -y ${rightCreeps}` 

    score = async (movie_path, chunks) => {
        // await this.generateFileTranformation(chunks);
        await bash(`ffmpeg -i ${movie_path} -i ${this.mask_path}  -filter_complex "[0:v][1:v] overlay=0:0,hue=s=0,negate,split=${this.generateFileTranformation(chunks)}" ${this.generateOutputs(chunks)}`);
    }
}