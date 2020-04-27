'use strict';

import {DesiredType, YpeType, MismatchingTypeInfo} from "./type-declarations";
const {
    getValueRepresentation,
    getRealTypeOf,
    normalizeTypeAssertion,
    compareTypesAndGetMismatchingTypeInfo,
    getArrayAsFriendlyString
} = require('./utils');
const ValueType = require('./types/value');
const RangeType = require('./types/range');
const ShapeType = require('./types/shape');
const InstanceType = require('./types/instance');

type TypeAssertion = Array<any>;


const buildTypeErrorMessage = (value: any, actualType: MismatchingTypeInfo, expectedTypeNames: string[]): string => {
    let type = "";
    if (expectedTypeNames.length === 1) {
        type = expectedTypeNames[0];
    } else {
        type = `either ${getArrayAsFriendlyString(expectedTypeNames)}`;
    }

    const valueRepresentation = getValueRepresentation(value, actualType.type);

    return `${valueRepresentation} is of the wrong type. Expected ${type}, but got ${actualType.name}.`
};

const assert = (value: any, desiredTypes: DesiredType[], error: TypeError) => {
    let realJsTypeOfValue = getRealTypeOf(value);

    let expectedTypeNames = [];
    let mismatchingType: MismatchingTypeInfo;

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

const ype = (...typeAssertions: TypeAssertion[]) => {
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

ype.makeCustomType = ({name, inherits, compareTypesAndGetMismatchingTypeInfo}): YpeType => {
    const BaseType = require('./types/base');
    const type = new BaseType;
    name && (type.name = name);
    type.inherits = inherits;
    type.compareTypesAndGetMismatchingTypeInfo = compareTypesAndGetMismatchingTypeInfo.bind(type);
    return type;
};

module.exports = ype;