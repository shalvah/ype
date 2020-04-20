'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const { getValueRepresentation, getRealTypeOf, normalizeTypeAssertion, compareTypesAndGetMismatchingTypeInfo, getArrayAsFriendlyString } = require('./utils');
const ValueType = require('./types/value');
const RangeType = require('./types/range');
const ShapeType = require('./types/shape');
const InstanceType = require('./types/instance');
const buildTypeErrorMessage = (value, actualType, expectedTypeNames) => {
    let type = "";
    if (expectedTypeNames.length === 1) {
        type = expectedTypeNames[0];
    }
    else {
        type = `either ${getArrayAsFriendlyString(expectedTypeNames)}`;
    }
    const valueRepresentation = getValueRepresentation(value, actualType);
    return `${valueRepresentation} is of the wrong type. Expected ${type}, but got ${actualType.name}.`;
};
const assert = (value, desiredTypes, error) => {
    let realJsTypeOfValue = getRealTypeOf(value);
    let expectedTypeNames = [];
    let mismatchingType = "";
    for (let desiredType of desiredTypes) {
        const desiredTypeInfo = normalizeTypeAssertion(desiredType);
        mismatchingType = compareTypesAndGetMismatchingTypeInfo(realJsTypeOfValue, desiredTypeInfo, value);
        if (mismatchingType === null) {
            return;
        }
        expectedTypeNames.push(desiredTypeInfo.name);
    }
    error.message = buildTypeErrorMessage(value, mismatchingType, expectedTypeNames);
    throw error;
};
const ype = (...typeAssertions) => {
    // Capture stack trace now so we don't show a nested function
    const error = new TypeError();
    Error.captureStackTrace(error, ype);
    for (let [value, ...types] of typeAssertions) {
        assert(value, types, error);
    }
};
ype.arrayOf = (...types) => types;
ype.range = (lower, upper) => new RangeType(lower, upper);
ype.shape = (shape) => new ShapeType(shape);
ype.values = (...values) => new ValueType(values);
ype.instanceOf = (classConstructor) => new InstanceType(classConstructor);
ype.makeCustomType = ({ name, inherits, compareTypesAndGetMismatchingTypeInfo }) => {
    const BaseType = require('./types/base');
    const type = new BaseType;
    name && (type.name = name);
    type.inherits = inherits;
    type.compareTypesAndGetMismatchingTypeInfo = compareTypesAndGetMismatchingTypeInfo.bind(type);
    return type;
};
module.exports = ype;
//# sourceMappingURL=index.js.map