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

    const valueRepresentation = getValueRepresentation(value, actualType);

    return `${valueRepresentation} is of the wrong type. Expected ${type}, but got ${actualType.name}.`
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

// Value type
ype.values = (...values) => {
  return {
      values,
      get name() {
          let valuesList = values.reduce((a, v) => {
              const valueType = getValueRepresentation(v, {type: getTypeOf(v)});
              return a + ', ' + valueType;
          }, '');
          valuesList = valuesList.substring(2); // Remove initial ", "
          return `one of values {${valuesList}}`;
      },
      isYpeType: true,
      check(value, valueType) {
          for (let allowedValue of values) {
              if (value === allowedValue) {
                  return true;
              }
          }

          let valueRepresentation = getValueRepresentation(value, {type: valueType});
          return {type: valueType, name: `value {${valueRepresentation}}`};
      }
  };
};

// Range type
// Only valid for numbers
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
          if (valueTypeOf === "number") {
              if (lower <= value && value <= upper) {
                  return true;
              }
              return {type: valueTypeOf, name: `value {${value}}`};
          }

          return {type: valueTypeOf, name: valueTypeOf};
      }
  };
};

ype.shape = (shape) => {
  return {
      shape,
      get name() {
          const shapeDescription = require('util').inspect(shape);
          return `an object with shape ${shapeDescription}`;
      },
      isYpeType: true,
      inherits: ['object'],
      check(object, valueTypeOf) {
          for (let [property, types] of Object.entries(shape)) {
              if (!(property in object)) {
                  return {type: 'object', name: `missing property ${property}`};
              }
          }

          for (let [property, types] of Object.entries(shape)) {
              const valueTypeOf = getTypeOf(object[property]);
              let mismatchedType;
              for (let expectedType of types) {
                  const normalizedType = normalizeType(expectedType);
                  if ((mismatchedType = checkType(valueTypeOf, normalizedType, object[property])) === true) {
                      return true;
                  }
              }
              return {type: 'object', name: `property ${property} is type ${valueTypeOf}`};
          }
          return true;
      },
  };
};

module.exports = ype;

const formatObject = (object) => {
    const { inspect } = require('util');
    return `${inspect(object, {breakLength: Infinity, compact: true, depth: 2 })}`
};

const getValueRepresentation = (value, valueType) => {
    let valueRepresentation = value;
    if (Array.isArray(value)) {
        valueRepresentation = `[${value}]`;
    } else if (valueType.type === "string") {
        valueRepresentation = `"${value}"`
    } else if (valueType.type === "object") {
        valueRepresentation = formatObject(value);
    }
    return valueRepresentation;
};