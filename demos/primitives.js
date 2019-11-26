const y = require("../src");

function doSomething(theString, theNumber, theBoolean, theArray) {
    y(
        [theString, String],
        [theNumber, Number],
        [theBoolean, Boolean],
        [theArray, Array],
        [theArray, [Number]],
    );

    return theNumber + 1;
}

doSomething("yes", 1, true, [] ); // This is OK
doSomething("1", 1, true, ["da"] ); // Gonna throw