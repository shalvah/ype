'use strict';
const { getValueRepresentation, getRealTypeOf, normalizeTypeAssertion, compareTypesAndGetMismatchingTypeInfo } = require('../utils');
const BaseType = require('./base');
class ShapeType extends BaseType {
    constructor(shape) {
        super();
        this.shape = shape;
        this.inherits = [Object];
    }
    computeName() {
        const shapeDescription = getValueRepresentation(this.shape, 'object');
        return `an object with shape ${shapeDescription}`;
    }
    compareTypesAndGetMismatchingTypeInfo(object, valueTypeOf) {
        const shapeEntries = Object.entries(this.shape);
        for (let [property, types] of shapeEntries) {
            if (!(property in object)) {
                return { type: 'object', name: `an object with missing property ${property}` };
            }
        }
        for (let [property, types] of shapeEntries) {
            const valueTypeOf = getRealTypeOf(object[property]);
            let mismatchedType;
            for (let expectedType of types) {
                const normalizedType = normalizeTypeAssertion(expectedType);
                if ((mismatchedType = compareTypesAndGetMismatchingTypeInfo(valueTypeOf, normalizedType, object[property])) === null) {
                    return null;
                }
            }
            return { type: 'object', name: `property ${property} as type ${valueTypeOf}` };
        }
        return null;
    }
}
module.exports = ShapeType;
//# sourceMappingURL=shape.js.map