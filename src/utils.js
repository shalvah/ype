const { inspect } = require('util');
const YpeType = require('./types/basetype');

const formatObject = (object) => {
    const formatted = `${inspect(object, {breakLength: Infinity, compact: true, depth: 2 })}`
    return formatted.replace(/\[Function: (\w+)?]/g, "$1")
};

const getValueRepresentation = (value, valueType) => {
    let valueRepresentation = value;
    if (Array.isArray(value)) {
        valueRepresentation = `[${value}]`;
    } else if (valueType.type === "string") {
        valueRepresentation = `'${value}'`
    } else if (valueType.type === "object") {
        valueRepresentation = formatObject(value);
    }
    return valueRepresentation;
};

const getTypeOf = (value) => {
    if (Array.isArray(value)) {
        return "array";
    }

    if (value === null) {
        return "null";
    }

    return typeof value;
};

const normalizeTypeAssertion = (type) => {
    if (type === String) {
        return {type: "string", name: "string"};
    }

    if (type === Number) {
        return {type: "number", name: "number"};
    }

    if (type === Boolean) {
        return {type: "boolean", name: "boolean"};
    }

    if (type === Object) {
        return {type: "object", name: "object"};
    }

    if (type === Function) {
        return {type: "function", name: "function"};
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
            const X = normalizeTypeAssertion(type[0]);
            return {type: ["array", X.type] , name: "array of " + X.name};
        }
    }

    if ("isYpeType" in type || type instanceof YpeType) {
        return type;
    }
};

// Returns true or the actual types
const checkType = (valueTypeOf, normalizedType, value) => {
    const expectedType = normalizedType.type;
    if (typeof expectedType === "string") {
        return valueTypeOf === normalizedType.type || {type: valueTypeOf, name: valueTypeOf};
    }

    if (Array.isArray(expectedType)) {
        if (expectedType[0] === "array") {
            // the second argument is the type of element in the array
            if (!Array.isArray(value)) {
                const type = getTypeOf(value);
                return {type, name: type};
            }
            for (let itemValue of value) {
                const actualType = checkType(getTypeOf(itemValue), {type: expectedType[1]}, itemValue);
                if (actualType !== true) {
                    return {type: 'array', name: "array containing " + actualType.type};
                }
            }
            // Empty arrays get a pass
            return true;
        }
    }


    if (normalizedType.isYpeType || normalizedType instanceof YpeType) {
        let mismatchedType;
        for (let superset of normalizedType.inherits || []) {
            if ((mismatchedType = checkType(valueTypeOf, { type: superset }, value)) !== true) {
                return mismatchedType;
            }
        }
        return normalizedType.check(value, valueTypeOf);
    }
};

module.exports = {
    getValueRepresentation,
    getTypeOf,
    normalizeTypeAssertion,
    checkType,
};