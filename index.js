var InsulaImmutableMiddleware = {
    constructor: function insulaImmutableConstructor() {
        this.accessStateAtSelector = function insulaImmutableAccessStateAtSelector(selector) {
            return this.state.getIn(selector, null);
        };
        
        this.setStateAtSelector = function insulaImmutableSetStateAtSelector(selector, value) {
            if (selector.length === 0) {
                this.setState(value);
            } else {
                this.setState(this.getState().setIn(selector, value));
            }
        };
    }
};

module.exports = InsulaImmutableMiddleware;