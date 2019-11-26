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
};

const checkType = (valueTypeOf, normalizedType) => {
    if (!Array.isArray(normalizedType)) {
        return valueTypeOf === normalizedType;
    }

    if (normalizedType[0] === "array") {
        // the second argument is the type of element in the array
    }
};

const buildMessage = (value, valueTypeOf, expectedTypeNames) => {
    let type = "";
    if (expectedTypeNames.length === 1) {
        type = expectedTypeNames[0];
    } else {
        type = `either ${expectedTypeNames.slice(0, -1).join(', ')} or ${expectedTypeNames[expectedTypeNames.length - 1]}`;
    }

    return `${value} is of the wrong type. Expected ${type}, but found ${valueTypeOf}.`
};

const assert = (value, types) => {
    let valueTypeOf = typeof value;
    if (Array.isArray(value)) {
        valueTypeOf = "array";
    }

    let expectedTypeNames = [];

    for (let type of types) {
        const normalizedType = normalizeType(type);
        if (checkType(valueTypeOf, normalizedType)) {
            return;
        }
        expectedTypeNames.push(normalizedType);
    }

    throw new TypeError(buildMessage(value, valueTypeOf, expectedTypeNames));
};

const ype = (...typeAssertions) => {
    for (let [value, ...types] of typeAssertions) {
        assert(value, types);
    }
};

module.exports = ype;