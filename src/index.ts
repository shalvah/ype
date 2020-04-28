'use strict';

const {
    getValueRepresentation,
    getRealTypeOf,
    normalizeTypeAssertion,
    compareTypesAndGetMismatchingTypeInfo,
    getArrayAsFriendlyString
} = require('./utils');
import ValueType = require('./types/value');
import RangeType = require('./types/range');
import ShapeType = require('./types/shape');
import InstanceType = require('./types/instance');

import {MismatchingTypeInfo, DesiredType, TypeAssertion, YpeType, RealJsType} from './declarations';


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
    const realJsTypeOfValue = getRealTypeOf(value);

    let expectedTypeNames = [];
    let mismatchingType: MismatchingTypeInfo;

    for (const desiredType of desiredTypes) {
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

ype.arrayOf = (...types: any[]) => types;

ype.range = (lower: Number, upper: Number) => new RangeType(lower, upper);

ype.shape = (shape: object) => new ShapeType(shape);

ype.values = (...values: any[]) => new ValueType(values);

ype.instanceOf = (classConstructor: Function) => new InstanceType(classConstructor);

ype.makeCustomType = ({name, computeName, inherits, compareTypesAndGetMismatchingTypeInfo}: {
    name?: string;
    inherits: DesiredType[] | null,
    computeName?: () => string,
    compareTypesAndGetMismatchingTypeInfo: (value: any, realJsTypeOfValue: RealJsType) => null | MismatchingTypeInfo,
}): YpeType => {
    const BaseType = require('./types/base');
    const type = new BaseType;
    name && (type.name = name);
    type.inherits = inherits;
    type.compareTypesAndGetMismatchingTypeInfo = compareTypesAndGetMismatchingTypeInfo.bind(type);
    return type;
};

export = ype;