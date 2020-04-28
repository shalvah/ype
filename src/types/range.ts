'use strict';

const BaseType = require("./base");

// Range type
class RangeType extends BaseType {
    constructor(public lower: Number, public upper: Number) {
        super();
        this.inherits = [Number];
    }

    computeName() {
        return `a number in range {${this.lower} - ${this.upper}}`;
    }

    compareTypesAndGetMismatchingTypeInfo(value, valueType) {
        if (valueType === "number") {
            if (this.lower <= value && value <= this.upper) {
                return null;
            }
            return {type: valueType, name: `value {${value}}`};
        }

        return {type: valueType, name: valueType};
    }
}

export = RangeType;
