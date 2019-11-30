'use strict';

class YpeType {
    constructor() {
        this._name = null;
        this.inherits = [];
    }

    [Symbol.for('nodejs.util.inspect.custom')]() {
        return this.name;
    }

    get name() {
        // Cache name value
        if (this._name == null) {
            this._name = this.computeName()
        }
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    check(value, valueType) {
        return true;
    }
}

module.exports = YpeType;