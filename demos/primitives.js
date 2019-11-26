const y = require("../src");

function a(theString, theNumber, theBoolean, theArray) {
    y(
        [theString, String],
        [theNumber, Number],
        [theBoolean, Boolean],
        [theArray, Array],
    );

    return theNumber + 1;
}

a("yes", 1, true, [] ); // This is OK
a(1, 1, true, [] ); // Gonna throw