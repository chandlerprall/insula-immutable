const Immutable = require('immutable');
const Store = require('insula');
const insulaImmutable = require('./index');

const store = new Store(
    Immutable.fromJS({
        foo: 'bar',
        deep: {
            nested: 'object',
        },
    }),
    [insulaImmutable]
);

function deepStateListener([value]) {
    console.error(`Deep state listener was called with "${value}", should happen twice`);
}
store.subscribeToState([['deep']], deepStateListener);

function deepNestedStateListener([value]) {
    console.info(`Deeply nested state listener was called with "${value}", should happen twice`);
}
store.subscribeToState([['deep', 'nested']], deepNestedStateListener);

store.setPartialState(['deep'], new Immutable.Map({nested: 'new object'}));

setTimeout(
    () => store.setPartialState(['deep', 'nested'], 'third object'),
    100
);