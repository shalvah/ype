'use strict';

const {getValueRepresentation, getTypeOf} = require('../utils');
const YpeType = require('./basetype');

// Value type
class ValueType extends YpeType {

    constructor(values) {
        super();
        this.values = values;
    }

    computeName() {
        let valuesList = this.values.reduce((a, v) => {
            const valueType = getValueRepresentation(v, {type: getTypeOf(v)});
            return a + ', ' + valueType;
        }, '');
        valuesList = valuesList.substring(2); // Remove initial ", "
        return `one of values {${valuesList}}`;
    }

    check(value, valueType) {
        for (let allowedValue of this.values) {
            if (value === allowedValue) {
                return true;
            }
        }

        let valueRepresentation = getValueRepresentation(value, {type: valueType});
        return {type: valueType, name: `value {${valueRepresentation}}`};
    }
}

module.exports = ValueType;