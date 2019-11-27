const y = require("../src");

function doSomething(theString, theNumber, theBoolean, theArray) {
    y(
        [theString, String],
        [theNumber, Number],
        [theBoolean, Boolean],
        [theArray, Array],
    );

    return theNumber + 1;
}

doSomething("yes", 1, true, []); // This is OK

try {
    doSomething(1, 1, true, [2]);
} catch (e) {
    console.log(e.stack);
}

function doSomething2(theObject, theFunction) {
    y(
        [theObject, Object],
        [theFunction, Function],
    );

}

doSomething2( {a: 1}, () => {});
doSomething2( {}, console.log);
doSomething2( {}, Object);
doSomething2( {}, new Function(""));

try {
    doSomething2( 3, () => {});
} catch (e) {
    console.log(e.stack);
}

try {
    doSomething2( {}, {});
} catch (e) {
    console.log(e.stack);
}