const y = require("../src");

const NumericStringType = y.makeCustomType({
    name: `a numeric string`,
    inherits: [String],
    check(value, valueType) {
        for (let char of value) {
            if (isNaN(parseInt(char, 10))) {
                return {type: valueType, name: `a non-digit '${char}'`}
            }
        }

        return true;
    }
});

const PinCodeType = y.makeCustomType({
    name: `a PIN code (4-digit string)`,
    inherits: [NumericStringType],
    check(value, valueType) {
        if (value.length !== 4) {
            return {type: valueType, name: `'${value}' (${value.length} digits)`}
        }

        for (let char of value) {
            if (isNaN(parseInt(char, 10))) {
                return {type: valueType, name: `a non-digit '${char}'`}
            }
        }

        return true;
    }
});

function doSomething(pinCode) {
    y([pinCode, PinCodeType]);

}

doSomething("6345");
try {
    doSomething("hahaha");
} catch (e) {
    console.log(e.stack);
}

try {
    doSomething(6);
} catch (e) {
    console.log(e.stack);
}

try {
    doSomething("6d44");
} catch (e) {
    console.log(e.stack);
}