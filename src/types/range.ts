'use strict';

namespace Ype {

    const BaseType = require("./base");

// Range type
    class RangeType extends BaseType {
        public lower: Number;
        public upper: Number;

        constructor(lower, upper) {
            super();
            this.lower = lower;
            this.upper = upper;
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

    module.exports = RangeType;
}