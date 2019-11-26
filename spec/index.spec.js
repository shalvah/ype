const y = require("../src/index");

describe("Type checking JS primitives", () => {

    function a(theString, theNumber, theBoolean, theArray) {
        y(
            [theString, String],
            [theNumber, Number],
            [theBoolean, Boolean],
            [theArray, Array],
        );

        return theNumber + 1;
    }
    // corecion
    // missing values

    it("doesn't throw on fully matching types", () => {
        a("yes", 1, true, [] );
    });

    it("throws on wrong types", () => {
        expect(
            () => a(1, 1, true, [] )
        ).toThrow(new TypeError('1 is of the wrong type. Expected string, but got number.'));
    });

});

describe("Type checking arrays of JS primitives", () => {

    function b(stringArray, numberArray, booleanArray) {
        y(
            [stringArray, [String]],
            [numberArray, [Number]],
            [booleanArray, [Boolean]],
        );
    }

    it("doesn't throw on fully matching types", () => {
        b(["yes"], [1], [true, false]);
        b(["yes"], [1], [true, false]);
        b(["yes"], [1], [true, false]);
    });

    it("throws on wrong types", () => {
        expect(
            () => b(["yes"], ["1"], [true])
        ).toThrow(new TypeError('[1] is of the wrong type. Expected array of number, but got array containing string.'));
        expect(
            () => b("yes", ["1"], [true])
        ).toThrow(new TypeError('"yes" is of the wrong type. Expected array of string, but got string.'));
    });

});



describe("Handling null/undefined values", () => {

    function c(var1, var2, var3) {
        y(
            [var1, String],
            [var2, Number],
            [var3, Boolean],
        );
    }

    it("throws on missing (undefined) values", () => {
        expect(
            () => c("1", 1)
        ).toThrow(new TypeError('undefined is of the wrong type. Expected boolean, but got undefined.'));
    });

    it("throws on explicit undefined values", () => {
        expect(
            () => c("1", 1, undefined)
        ).toThrow(
            new TypeError('undefined is of the wrong type. Expected boolean, but got undefined.')
        );
    });

    it("throws on explicit undefined values", () => {
        expect(
            () => c("1", 1, null)
        ).toThrow(
            new TypeError('null is of the wrong type. Expected boolean, but got null.')
        );
    });

});