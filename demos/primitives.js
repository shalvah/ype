const y = require("../src");

function doSomething(theString, theNumber, theBoolean, theArray, theObject) {
    y(
        [theString, String],
        [theNumber, Number],
        [theBoolean, Boolean],
        [theArray, Array],
        [theObject, Object],
    );

    return theNumber + 1;
}

doSomething("yes", 1, true, [], {}); // This is OK

try {
    doSomething(1, 1, true, [2], {});
} catch (e) {
    console.log(e.stack);
}

try {
    doSomething("yes", 1, true, [2], 3);
} catch (e) {
    console.log(e.stack);
}