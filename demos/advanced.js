const y = require("../src");

function doSomething(var1, var2, var3) {
    y(
        [var1, y.values("one", 2)],
        [var2, y.values(3, 4, 5)],
        [var3, y.values(9, false), null],
    );
}

// OK
doSomething("one", 4, false);
doSomething("one", 5, 9);
doSomething(2, 3, null);

// Error
try {
    doSomething("four", 3, null);
} catch (e) {
    console.log(e.stack);
}

function doSomething2(var1) {
    y(
        [var1, y.range(2, 7)],
    );
}

doSomething2(5);
doSomething2(2);
doSomething2(7);

try {
    doSomething2(1);
}  catch (e) {
    console.log(e.stack);
}

try {
    doSomething2("gh");
}  catch (e) {
    console.log(e.stack);
}