'use strict';

const normalizeType = (type) => {
    if (type === String) {
        return "string";
    }

    if (type === Number) {
        return "number";
    }

    if (type === Boolean) {
        return "boolean";
    }

    if (type === null) {
        return "null";
    }

    if (type === Array) {
        return "array";
    }

    if (Array.isArray(type)) {
        if (type.length === 1) {
            // an array of X
            return ["array", normalizeType(type[0])];
        }
    }
};

// Returns true or the actual types
const checkType = (valueTypeOf, normalizedType, value) => {
    if (!Array.isArray(normalizedType)) {
        return valueTypeOf === normalizedType || valueTypeOf;
    }

    if (normalizedType[0] === "array") {
        // the second argument is the type of element in the array
        for (let itemValue of value) {
            const actualType = checkType(getTypeOf(itemValue), normalizedType[1], itemValue);
            if (actualType !== true) {
                return actualType;
            }
        }
        // Empty arrays get a pass
        return true;
    }
};

const buildMessage = (value, actualTypes, expectedTypeNames) => {
    let type = "";
    if (expectedTypeNames.length === 1) {
        type = expectedTypeNames[0];
    } else {
        type = `either ${expectedTypeNames.slice(0, -1).join(', ')} or ${expectedTypeNames[expectedTypeNames.length - 1]}`;
    }

    return `${value} is of the wrong type. Expected ${type}, but found ${actualTypes}.`
};

const getTypeOf = (value) => {
    let valueTypeOf = typeof value;
    if (Array.isArray(value)) {
        valueTypeOf = "array";
    }
    return valueTypeOf;
}

const assert = (value, types, error) => {
    let valueTypeOf = getTypeOf(value);

    let expectedTypeNames = [];
    let actualType = "";

    for (let type of types) {
        const normalizedType = normalizeType(type);
        actualType = checkType(valueTypeOf, normalizedType, value);
        if (actualType === true) {
            return;
        }
        expectedTypeNames.push(normalizedType);
    }

    error.message = buildMessage(value, actualType, expectedTypeNames);
    throw error;
};

const ype = (...typeAssertions) => {
    const error = new TypeError();
    Error.captureStackTrace(error, ype);
    for (let [value, ...types] of typeAssertions) {
        assert(value, types, error);
    }
};

module.exports = ype;