const y = require("../src");

class X {}
class Y extends X {}
class MyError extends TypeError {}

function doSomething(var1, var2) {
    y(
        [var1, y.instanceOf(Error)], [var2, y.instanceOf(X)],
    );
}
// OK
doSomething(new Error, new X);
doSomething(new Error, new Y);
doSomething(new TypeError, new Y);
doSomething(new MyError, new X);

// Errors
try {
    doSomething(1, new X);
} catch (e) {
    console.log(e.stack);
}

try {
    doSomething(new Error, "hahaha");
} catch (e) {
    console.log(e.stack);
}

try {
    doSomething(new X);
} catch (e) {
    console.log(e.stack);
}