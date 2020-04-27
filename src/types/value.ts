'use strict';

const {getValueRepresentation, getRealTypeOf} = require('../utils');

namespace Ype {

    const BaseType = require('./base');

// Value type
    class ValueType extends BaseType {

        constructor(values) {
            super();
            this.values = values;
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

    module.exports = ValueType;
}