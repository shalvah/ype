const y = require("../src");

const PinCodeType = y.makeCustomType({
    name: `a PIN code (4-digit string)`,
    inherits: ['string'],
    // The check should return true if the value is valid.
    // Otherwise it returns type information about the value.
    check(value, valueType) {
        // At this point, value is definitely a string
        // (because of our `inherits` specifier earlier
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