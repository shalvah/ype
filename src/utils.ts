import {RealJsType, MismatchingTypeInfo, DesiredType, DesiredTypeInfo, YpeType} from "./declarations";

const {inspect} = require('util');
const BaseType = require('./types/base');


const formatObject = (object: object): string => {
    const formatted = `${inspect(object, {breakLength: Infinity, compact: true, depth: 2})}`;
    return formatted.replace(/\[Function: (\w+)?]/g, "$1")
};

const getValueRepresentation = (value: any, valueType: RealJsType): string => {
    let valueRepresentation = value;
    if (Array.isArray(value)) {
        valueRepresentation = `[${value}]`;
    } else if (valueType === "string") {
        valueRepresentation = `'${value}'`
    } else if (valueType === "object") {
        valueRepresentation = formatObject(value);
    }
    return valueRepresentation;
};

const getRealTypeOf = (value: any): RealJsType => {
    if (Array.isArray(value)) {
        return "array";
    }

    if (value === null) {
        return "null";
    }

    return typeof value;
};

const normalizeTypeAssertion = (desiredType: DesiredType): DesiredTypeInfo => {
    if (desiredType === String) {
        return {type: "string", name: "string"};
    }

    if (desiredType === Number) {
        return {type: "number", name: "number"};
    }

    if (desiredType === Boolean) {
        return {type: "boolean", name: "boolean"};
    }

    if (desiredType === Object) {
        return {type: "object", name: "object"};
    }

    if (desiredType === Function) {
        return {type: "function", name: "function"};
    }

    if (desiredType === null) {
        return {type: "null", name: "null"};
    }

    if (desiredType === Array) {
        return {type: "array", name: "array"};
    }

    if (desiredType === BigInt) {
        return {type: "bigint", name: "bigint"};
    }

    if (desiredType === Symbol) {
        return {type: "symbol", name: "symbol"};
    }

    if (Array.isArray(desiredType)) {
        // an array of X, Y or Z
        const validItemTypes = {
            names: [],
            types: [],
        };
        for (let itemType of desiredType) {
            const T = normalizeTypeAssertion(itemType);
            validItemTypes.names.push(T.name);
            validItemTypes.types.push(isCustomType(T) ? T.name : T.type);
        }

        return {
            type: ["array", ...validItemTypes.types],
            get name() {
                return "array of " + getArrayAsFriendlyString(validItemTypes.names)
            },
        };
    }

    if (isCustomType(desiredType)) {
        return desiredType;
    }
};

const isCustomType = (type: any): type is YpeType => {
    return type instanceof BaseType;
};

const compareTypesAndGetMismatchingTypeInfo = (
    realJsTypeOfValue: RealJsType,
    desiredTypeInfo: YpeType | {type: RealJsType | Array<RealJsType> },
    value: any
): MismatchingTypeInfo => {
    // @ts-ignore
    const expectedType = desiredTypeInfo.type;
    if (typeof expectedType === "string") {
        return realJsTypeOfValue === (desiredTypeInfo as {type: RealJsType | Array<RealJsType>}).type
            ? null : {type: realJsTypeOfValue, name: realJsTypeOfValue};
    }

    if (Array.isArray(expectedType)) {
        if (expectedType[0] === "array") {
            // The remaining arguments are the allowed types of element in the array
            if (!Array.isArray(value)) {
                const type = getRealTypeOf(value);
                return {type, name: type};
            }

            if (value.length === 0) {
                // Empty arrays get a pass
                return null;
            }

            let actualType;
            const possibleTypes = expectedType.slice(1);
            for (const itemValue of value) {
                let itemPassing = false;
                for (const possibleType of possibleTypes) {
                    actualType = compareTypesAndGetMismatchingTypeInfo(getRealTypeOf(itemValue), {type: possibleType}, itemValue);
                    if (actualType === null) {
                        // This item matches the spec, continue to next item.
                        itemPassing = true;
                        break;
                    }
                }
                if (itemPassing === false) {
                    return {type: 'array', name: "array containing " + actualType.type};
                }
            }

            return null;
        }
    }

    if (isCustomType(desiredTypeInfo)) {
        let mismatchedType;
        for (const superset of desiredTypeInfo.inherits || []) {
            if ((mismatchedType = compareTypesAndGetMismatchingTypeInfo(realJsTypeOfValue, normalizeTypeAssertion(superset), value)) !== null) {
                return mismatchedType;
            }
        }

        mismatchedType = desiredTypeInfo.compareTypesAndGetMismatchingTypeInfo(value, realJsTypeOfValue);
        return mismatchedType === true ? null : mismatchedType;
    }
};

// [1] becomes "1"
// [1, 2] becomes "1 or 2"
// [1, 2, 3] becomes "1, 2, or 3"
const getArrayAsFriendlyString = (array: string[]): string => {
    switch (array.length) {
        case 1:
            return array[0];

        case 2:
            return array[0] + " or " + array[1];

        default:
            return `${array.slice(0, -1).join(', ')}`
                + `, or ${array[array.length - 1]}`
    }

};

export = {
    getValueRepresentation,
    getRealTypeOf,
    normalizeTypeAssertion,
    compareTypesAndGetMismatchingTypeInfo,
    getArrayAsFriendlyString,
};