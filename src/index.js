'use strict';

const normalizeType = (type) => {
    if (type === String) {
        return {type: "string", name: "string"};
    }

    if (type === Number) {
        return {type: "number", name: "number"};
    }

    if (type === Boolean) {
        return {type: "boolean", name: "boolean"};
    }

    if (type === null) {
        return {type: "null", name: "null"};
    }

    if (type === Array) {
        return {type: "array", name: "array"};
    }

    if (Array.isArray(type)) {
        if (type.length === 1) {
            // an array of X
            const X = normalizeType(type[0]);
            return {type: ["array", X.type] , name: "array of " + X.name};
        }
    }
};

// Returns true or the actual types
const checkType = (valueTypeOf, normalizedType, value) => {
    if (!Array.isArray(normalizedType.type)) {
        return valueTypeOf === normalizedType.type || valueTypeOf;
    }

    if (normalizedType.type[0] === "array") {
        // the second argument is the type of element in the array
        if (!Array.isArray(value)) {
            return getTypeOf(value);
        }
        for (let itemValue of value) {
            const actualType = checkType(getTypeOf(itemValue), {type: normalizedType.type[1]}, itemValue);
            if (actualType !== true) {
                return "array containing " + actualType;
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

    let valueRepresentation = value;
    if (Array.isArray(value)) {
        valueRepresentation = `[${value}]`;
    }

    return `${valueRepresentation} is of the wrong type. Expected ${type}, but got ${actualTypes}.`
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
        expectedTypeNames.push(normalizedType.name);
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