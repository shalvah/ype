const {inspect} = require('util');
const YpeType = require('./types/basetype');

const formatObject = (object) => {
    const formatted = `${inspect(object, {breakLength: Infinity, compact: true, depth: 2})}`
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
        // an array of X, Y or Z
        const validItemTypes = {
            names: [],
            types: [],
        };
        for (let itemType of type) {
            const T = normalizeTypeAssertion(itemType);
            validItemTypes.names.push(T.name);
            validItemTypes.types.push(T.type);
        }

        return {
            type: ["array", ...validItemTypes.types],
            get name() {
                return "array of " + getArrayAsFriendlyString(validItemTypes.names)
            },
        };
    }

    if (type instanceof YpeType) {
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
            // The remaining arguments are the allowed types of element in the array
            if (!Array.isArray(value)) {
                const type = getTypeOf(value);
                return {type, name: type};
            }

            if (value.length === 0) {
                // Empty arrays get a pass
                return true;
            }

            let actualType;
            const possibleTypes = expectedType.slice(1);
            for (let itemValue of value) {
                let itemPassing = false;
                for (let possibleType of possibleTypes) {
                    actualType = checkType(getTypeOf(itemValue), {type: possibleType}, itemValue);
                    if (actualType === true) {
                        // This item matches the spec, continue to next item.
                        itemPassing = true;
                        break;
                    }
                }
                if (itemPassing === false) {
                    return {type: 'array', name: "array containing " + actualType.type};
                }
            }

            return true;
        }
    }


    if (normalizedType instanceof YpeType) {
        let mismatchedType;
        for (let superset of normalizedType.inherits || []) {
            if ((mismatchedType = checkType(valueTypeOf, normalizeTypeAssertion(superset), value)) !== true) {
                return mismatchedType;
            }
        }
        return normalizedType.check(value, valueTypeOf);
    }
};

// [1] becomes "1"
// [1, 2] becomes "1 or 2"
// [1, 2, 3] becomes "1, 2, or 3"
const getArrayAsFriendlyString = (array) => {
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

module.exports = {
    getValueRepresentation,
    getTypeOf,
    normalizeTypeAssertion,
    checkType,
};