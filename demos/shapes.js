const y = require("../src");

function doSomething(var1) {
    y(
        [var1, y.shape({a: [String], b: [Number]})],
    );
}
// OK
doSomething({a: "one", b: 2});

// Error
try {
    doSomething("four");
} catch (e) {
    console.log(e.stack);
}

try {
    doSomething({b: 2});
} catch (e) {
    console.log(e.stack);
}


try {
    doSomething({a: 5, b: 2});
} catch (e) {
    console.log(e.stack);
}
