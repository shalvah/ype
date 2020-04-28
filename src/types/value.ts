'use strict';

import BaseType = require('./base');
const {getValueRepresentation, getRealTypeOf} = require('../utils');

// Value type
class ValueType extends BaseType {
    constructor(public values: any[]) {
        super();
    }

    computeName() {
        let valuesList = this.values.reduce((a, v) => {
            const valueType = getValueRepresentation(v, getRealTypeOf(v));
            return a + ', ' + valueType;
        }, '');
        valuesList = valuesList.substring(2); // Remove initial ", "
        return `one of values {${valuesList}}`;
    }

    compareTypesAndGetMismatchingTypeInfo(value, valueType) {
        for (let allowedValue of this.values) {
            if (value === allowedValue) {
                return null;
            }
        }

        let valueRepresentation = getValueRepresentation(value, valueType);
        return {type: valueType, name: `value {${valueRepresentation}}`};
    }
}

export = ValueType;