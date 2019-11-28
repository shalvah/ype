const { inspect } = require('util');

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

module.exports = {
    formatObject,
    getValueRepresentation,
};