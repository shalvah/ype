# ype

[Coming soon]

TypeScript is cool, but type errors can still slip into your code. Ype gives you runtime type assertions in JavaScript.

You can use them anywhere you need to, but the major use case is in function arguments.

Examples:


```js
const y = require("ype");

function sendEmailToUser(message, userId, replyTo) {
    y(
        [message, String],
        [userId, Number],
        [replyTo, String],
    );
   
    // Continue with the rest of your code. 
    // At this point, `userId` will definitely be a Number, 
    // so if you do userId + 1, you won't see nonsense like "undefined1"
}

sendEmailToUser("Hi there!", 1, "help@domain.com"); // This is OK
sendEmailToUser("Hi there!", "one", "help@domain.com"); // This will throw, because "one" is not a number
```

![](example.png)

You can have nullable types, union types and more:

```js
const y = require("ype");

function sendEmailToUsers(message, userIds, replyTo = null) {
    y(
        [message, String],
        [userIds, Number, [Number]], // a number of array of numbers
        [replyTo, String, null], // nullable type
    );
}

sendEmailToUser("Hi there!", 1, "help@domain.com"); // This is OK
sendEmailToUser("Hi there!", [1, 3], "help@domain.com"); // This is OK
sendEmailToUser("Hi there!", ["one"], "help@domain.com"); // This will throw
```

More:
```js
// Going further
function doSomething(var1, var2, var3, var4, var5, var6) {
    types(
        [var1, types.union(String, [String])],  // union types
        [var1, String, [String]],  // also union types
        [var1, String, null],  // nullable types
        [var2, types.only("this", "that")],  // same as "this" | "that" and enums in TypeScript
        [var3, types.range(2, 7)], // Range. Only valid for Numbers and subsets
        [var4, types.integer().range(2, 7)],
        [var5, types.shape({a: [String], b: [Number, null], c: [[String], String], d: types.only(1, 3)})], // structural typing
        [var6, types.instance(MyClass)], // instance of a class
    );
}

// define and reuse types
types.Car = types.shape({
    tyres: [Number],
    doors: types.integer().range(1, 4),
    model: [String],
});

function doSomething(var1) {
    types(
        [var1, types.Car],
    );
}

// and if you want generics...
function doSomething(var1, var2) {
    types(
        [var1, (T) => T],
        [var2, (T) => types.shape({a: [T]})],
    );
}
```