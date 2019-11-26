const y = require("../src");

function doSomething(stringArray, numberArray, booleanArray) {
    y(
        [stringArray, [String]],
        [numberArray, [Number]],
        [booleanArray, [Boolean]],
    );

}

doSomething("yes", 1, true, [] ); // This is OK
doSomething("1", 1, true, [2] );
doSomething("1", 1, true, [true, false] ); // Gonna throw