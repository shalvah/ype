const y = require("../src");

function doSomething(stringArray, numberArray, booleanArray, multiArray = [1]) {
    y(
        [stringArray, [String]],
        [numberArray, [Number]],
        [booleanArray, [Boolean]],
        [multiArray, [Boolean, Number]],
    );

}

doSomething(["yes"], [1], [true]);
doSomething(["yes"], [1], [true], [false, 2]);

// Errors
doSomething(["1"], [1], false);