'use strict';

const YpeType = require('./basetype');

class InstanceType extends YpeType {

    constructor(classConstructor) {
        super();
        this.classConstructor = classConstructor;
    }

    computeName() {
        let className = this.classConstructor.prototype.constructor.name;
        return `an instance of class ${className}`;
    }

    check(value, valueType) {
        if (value instanceof this.classConstructor) {
            return true;
        }

        let valueRepresentation = valueType;
        if (valueType === 'object'
            && value.constructor
            && value.constructor.name) {
            valueRepresentation = `an instance of class ${value.constructor.name}`;
        }

        return {type: valueType, name: valueRepresentation};
    }
}

module.exports = InstanceType;