const y = require("../src");

function doSomething(var1, var2, var3) {
    y(
        [var1, y.values("one", "two")],
        [var2, y.values(3, 4, 5)],
        [var3, y.values(9, false), null],
    );
}

// OK
doSomething("one", 4, false);
doSomething("one", 5, 9);
doSomething("two", 3, null);

// Error
doSomething("four", 3, null);