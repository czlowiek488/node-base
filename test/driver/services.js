const Api = require('../../driver/service/api');
const MessageBroker = require('../../driver/broker/nats');
const Nats = MessageBroker();

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
    const logic = {
        test: async ({ index }) => {
            return { index: index + 1 };
        }
    };
    const eventHandler = ({ event, message }) => {
        switch (event) {
            case 'running': requestInternal('API.Test1', { endpoint: 'start', data: { index: 0 } }).then(console.log)
        }
    }
    return Object.freeze({ logic, eventHandler });
}

Api({ MessageBroker: Nats, config: { name: 'Test1', Model: ModelOne } });
Api({ MessageBroker: Nats, config: { name: 'Test2', Model: ModelTwo } });