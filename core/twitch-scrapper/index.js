const StreamCollector = require('./collector');
const Extractor = require('./extractor');
const {read} = require('./reader');
module.exports = class StreamReader {
    constructor({ mask_path, root_path, channel_url, resolution}) {
        this.root_path = root_path;
        this.collector = new StreamCollector({ resolution, channel_url, root_path });
        this.extractor = new Extractor({mask_path});
    }

    run = () => 
        this.collector.run();

    read = async  ({movie_path, chunks}) => {
        await this.collector.getChunk(movie_path);
        await this.extractor.score(movie_path, chunks);
        return Promise.all(chunks.map(read))
    }


    log(config, result) {
        // require('fs').appendFileSync(`${this.root_path}/log_contrast_and_gamma_tests.json`, require('util').inspect({date: (new Date()).toString(), result, settings: config }, {depth:Infinity, breakLength: Infinity}) + '\n');
        return {config,result};
    }
}