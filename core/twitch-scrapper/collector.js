const m3u8stream = require('m3u8stream')
const {createWriteStream, unlinkSync, existsSync} = require('fs');
const {bash} = require('../core/executor');

const time = () => (new Date()).getTime();
const emptyListener = () => {};

module.exports = class StreamCollector {
    constructor({channel_url, resolution = 720, framerate = '60'}) {
        this.channel_url = channel_url;
        this.quality = `${resolution}p,${resolution}p${framerate}`;
    }

     getStreamUrl = async () => {
        const result = await bash(`streamlink ${this.channel_url} ${this.quality} --json`);
        const {url} = JSON.parse(result);
        return url;
    }

    run = async () => { 
        this.stream = m3u8stream(await this.getStreamUrl(), {chunkReadahead: 0, liveBuffer: 30});
        this.stream.on('data', emptyListener);
        this.stream.on('end', () => {});
        this.stream.on('error', () => {});
    }    

    progressToFile = desired_size => new Promise(resolve => {
        let current_size = 0;
        const collectUntilEndOfProgress = (chunk) => {
            if(desired_size <= current_size) {
                this.stream.removeListener('data',collectUntilEndOfProgress)
                this.stream.on('data', emptyListener);
                resolve();
            }
            current_size += chunk.length; 
         }
        this.stream.on('data', collectUntilEndOfProgress);
        this.stream.removeListener('data', emptyListener);
    })

    getChunk = file_path => new Promise(resolve => {
        const start_time = time();
        if(existsSync(file_path)) unlinkSync(file_path);
        this.stream.once('progress', async ({ size }) => {
            this.stream.pipe(createWriteStream(file_path));
            await this.progressToFile(size);
            this.stream.unpipe();
            resolve({duration: time() - start_time, size, file_path });
        });
    })
}
