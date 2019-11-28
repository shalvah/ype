'use strict';

const YpeType = require('./basetype');

// Range type
class RangeType extends YpeType {

    constructor(lower, upper) {
        super();
        this.lower = lower;
        this.upper = upper;
        this.inherits = ['number'];
    }

    computeName() {
        return `a number in range {${this.lower} - ${this.upper}}`;
    }

    check(value, valueType) {
        if (valueType === "number") {
            if (this.lower <= value && value <= this.upper) {
                return true;
            }
            return {type: valueType, name: `value {${value}}`};
        }

        return {type: valueType, name: valueType};
    }
}

module.exports = RangeType;