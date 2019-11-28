'use strict';

const {getValueRepresentation, getTypeOf, normalizeTypeAssertion, checkType} = require('../utils');
const YpeType = require('./basetype');

class ShapeType extends YpeType {

    constructor(shape) {
        super();
        this.shape = shape;
        this.inherits = ['object'];
    }

    computeName() {
        const shapeDescription = getValueRepresentation(this.shape, {type: 'object'});
        return `an object with shape ${shapeDescription}`
    }

    check(object, valueTypeOf) {
        const shapeEntries = Object.entries(this.shape);

        for (let [property, types] of shapeEntries) {
            if (!(property in object)) {
                return {type: 'object', name: `an object with missing property ${property}`};
            }
        }

        for (let [property, types] of shapeEntries) {
            const valueTypeOf = getTypeOf(object[property]);
            let mismatchedType;
            for (let expectedType of types) {
                const normalizedType = normalizeTypeAssertion(expectedType);
                if ((mismatchedType = checkType(valueTypeOf, normalizedType, object[property])) === true) {
                    return true;
                }
            }
            return {type: 'object', name: `property ${property} as type ${valueTypeOf}`};
        }

        return true;
    }
}

module.exports = ShapeType;