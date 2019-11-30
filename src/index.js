'use strict';

const {getValueRepresentation, getTypeOf, normalizeTypeAssertion, checkType} = require('./utils');
const ValueType = require('./types/value');
const RangeType = require('./types/range');
const ShapeType = require('./types/shape');
const InstanceType = require('./types/instance');

const buildTypeErrorMessage = (value, actualType, expectedTypeNames) => {
    let type = "";
    if (expectedTypeNames.length === 1) {
        type = expectedTypeNames[0];
    } else {
        type = `either ${expectedTypeNames.slice(0, -1).join(', ')} or ${expectedTypeNames[expectedTypeNames.length - 1]}`;
    }

    const valueRepresentation = getValueRepresentation(value, actualType);

    return `${valueRepresentation} is of the wrong type. Expected ${type}, but got ${actualType.name}.`
};

const assert = (value, types, error) => {
    let valueTypeOf = getTypeOf(value);

    let expectedTypeNames = [];
    let actualType = "";

    for (let type of types) {
        const normalizedType = normalizeTypeAssertion(type);
        actualType = checkType(valueTypeOf, normalizedType, value);
        if (actualType === true) {
            return;
        }
        expectedTypeNames.push(normalizedType.name);
    }

    error.message = buildTypeErrorMessage(value, actualType, expectedTypeNames);
    throw error;
};

const ype = (...typeAssertions) => {
    const error = new TypeError();
    Error.captureStackTrace(error, ype);
    for (let [value, ...types] of typeAssertions) {
        assert(value, types, error);
    }
};

ype.range = (lower, upper) => new RangeType(lower, upper);

ype.shape = (shape) => new ShapeType(shape);

ype.values = (...values) => new ValueType(values);

ype.instanceOf = (classConstructor) => new InstanceType(classConstructor);

ype.makeCustomType = ({name, inherits, check}) => {
    const YpeType = require('./types/basetype');
    const type = new YpeType;
    name && (type.name = name);
    type.inherits = inherits;
    type.check = check.bind(type);
    return type;
};

module.exports = ype;