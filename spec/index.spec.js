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

