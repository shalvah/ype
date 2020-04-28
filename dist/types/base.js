'use strict';
class BaseType {
    constructor() {
        this._name = null;
        this.inherits = [];
    }
    [Symbol.for('nodejs.util.inspect.custom')]() {
        return this.name;
    }
    get name() {
        // Cache name value
        if (this._name == null) {
            this._name = this.computeName();
        }
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
    compareTypesAndGetMismatchingTypeInfo(value, realJsTypeOfValue) {
        return null;
    }
    computeName() {
        return undefined;
    }
}
module.exports = BaseType;
//# sourceMappingURL=base.js.map