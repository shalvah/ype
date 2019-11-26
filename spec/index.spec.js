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
        ).toThrow(new TypeError('1 is of the wrong type. Expected string, but found number.'));
    });

});

describe("Type checking arrays of JS primitives", () => {

    function b(theString, theNumber, theBoolean, theArray) {
        y(
            [theString, String],
            [theNumber, Number],
            [theBoolean, Boolean],
            [theArray, [Number]],
        );

    }

    it("doesn't throw on fully matching types", () => {
        b("yes", 1, true, [] );
        b("yes", 1, true, [2] );
    });

    it("throws on wrong types", () => {
        expect(
            () => b("yes", 1, true, ["ya"] )
        ).toThrow(new TypeError('[ya] is of the wrong type. Expected array of number, but found array containing string.'));
    });

});

