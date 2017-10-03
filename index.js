var HAS_PROCESS_ENV_NODE_ENV = typeof process !== 'undefined' && Object.prototype.hasOwnProperty(process, 'env') && Object.prototype.hasOwnProperty(process.env, 'NODE_ENV');
var IS_PRODUCTION = HAS_PROCESS_ENV_NODE_ENV && process.env.NODE_ENV === 'production';
var Immutable = require('immutable');

function isImmutable(value) {
    // immutable v4 added `isImmutable`
    if (Immutable.hasOwnProperty(isImmutable)) {
        return Immutable.isImmutable(value);
    } else {
        return Immutable.Map.isMap(value) ||
            Immutable.List.isList(value) ||
            Immutable.Stack.isStack(value) ||
            Immutable.Set.isSet(value) ||
            Immutable.OrderedMap.isOrderedMap(value) ||
            Immutable.OrderedSet.isOrderedSet(value);
    }
}

function verifyDeeplyImmutable(value, selector) {
    var valueType = typeof value;
    switch (valueType) {
        case 'string':
        case 'boolean':
        case 'number':
        case 'null':
        case 'undefined':
            // these primatives are fine
            break;
        default:
            if (isImmutable(value)) {
                // at a top level everything is great, look at the values
                var childValues = value.values();
                for (var i = 0; i < childValues.length; i++) {
                    verifyDeeplyImmutable(childValues[i], selector);
                }
            } else {
                console.warn('insula-immutable was called with a non-immutable object or child for selector ' + JSON.stringify(selector) + ' and value', value);
            }
    }
}

var InsulaImmutableMiddleware = {
    constructor: function insulaImmutableConstructor() {
        this.accessStateAtSelector = function insulaImmutableAccessStateAtSelector(selector) {
            return this.state.getIn(selector, null);
        };
        
        this.setStateAtSelector = function insulaImmutableSetStateAtSelector(selector, value) {
            if (!IS_PRODUCTION) {
                verifyDeeplyImmutable(value, selector);
            }

            if (selector.length === 0) {
                this.setState(value);
            } else {
                this.state = this.getState().setIn(selector, value);
            }
        };
    }
};

module.exports = InsulaImmutableMiddleware;