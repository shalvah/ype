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
            const X = normalizeType(type[0]);
            return {type: ["array", X.type] , name: "array of " + X.name};
        }
    }

    if ("isYpeType" in type) {
        return type;
    }
};

// Returns true or the actual types
const checkType = (valueTypeOf, normalizedType, value) => {
    const expectedType = normalizedType.type;
    if (typeof expectedType === "string") {
        return valueTypeOf === normalizedType.type || valueTypeOf;
    }

    if (Array.isArray(expectedType)) {
        if (expectedType[0] === "array") {
            // the second argument is the type of element in the array
            if (!Array.isArray(value)) {
                return getTypeOf(value);
            }
            for (let itemValue of value) {
                const actualType = checkType(getTypeOf(itemValue), {type: expectedType[1]}, itemValue);
                if (actualType !== true) {
                    return "array containing " + actualType;
                }
            }
            // Empty arrays get a pass
            return true;
        }
    }


    if (normalizedType.isYpeType) {
        let mismatchedType;
        for (let superset of normalizedType.inherits || []) {
            if ((mismatchedType = checkType(valueTypeOf, { type: superset }, value)) !== true) {
                return mismatchedType;
            }
        }
        return normalizedType.check(value, valueTypeOf);
    }
};

const buildMessage = (value, actualType, expectedTypeNames) => {
    let type = "";
    if (expectedTypeNames.length === 1) {
        type = expectedTypeNames[0];
    } else {
        type = `either ${expectedTypeNames.slice(0, -1).join(', ')} or ${expectedTypeNames[expectedTypeNames.length - 1]}`;
    }

    let valueRepresentation = value;
    if (Array.isArray(value)) {
        valueRepresentation = `[${value}]`;
    } else if (actualType === "string") {
        valueRepresentation = `"${value}"`
    }

    return `${valueRepresentation} is of the wrong type. Expected ${type}, but got ${actualType}.`
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

ype.values = (...values) => {
  return {
      values,
      get name() {
          return `one of values {${values.join(', ')}}`;
      },
      isYpeType: true,
      check(value) {
          for (let allowedValue of values) {
              if (value === allowedValue) {
                  return true;
              }
          }

          return `value {${value}}`;
      }
  };
};

ype.range = (lower, upper) => {
  return {
      range: {
          lower,
          upper,
      },
      get name() {
          return `a number in range {${lower} - ${upper}}`;
      },
      isYpeType: true,
      inherits: ['number'],
      check(value, valueTypeOf) {
          // Range type
          // Only valid for numbers
          if (valueTypeOf === "number") {
              if (lower <= value && value <= upper) {
                  return true;
              }
              return `value {${value}}`;
          }

          return valueTypeOf;
      }
  };
};

module.exports = ype;