const Api = require('../../driver/service/api');
const MessageBroker = require('../../driver/broker/nats');
const ModelOne = ({ requestInternal }) => {
    const logic = {
        start: async ({ index }) => {
            const { index: new_index } = await requestInternal('API.Test2', { endpoint: 'test', data: { index } });
            return { index: new_index + 1 };
        }
    };
    return Object.freeze({ logic });
};
const ModelTwo = ({ requestInternal }) => {
    const run = () =>
        requestInternal('API.Test1', { endpoint: 'start', data: { index: 0 } }).then(console.log);
    const logic = {
        test: async ({ index }) => {
            return { index: index + 1 };
        }
    };
    const eventHandler = ({ event }) => {
        switch (event) {
            case 'running': run()
        }
    }
    return Object.freeze({ logic, eventHandler });
}

Api({ MessageBroker: MessageBroker(), config: { name: 'Test1', Model: ModelOne } });
Api({ MessageBroker: MessageBroker(), config: { name: 'Test2', Model: ModelTwo } });