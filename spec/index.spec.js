const y = require('../src/index');

describe('Type checking primitives', () => {

    function a(theString, theNumber, theBoolean, theArray) {
        y(
            [theString, String],
            [theNumber, Number],
            [theBoolean, Boolean],
            [theArray, Array],
        );

        return theNumber + 1;
    }
    // coercion

    it('doesn\'t throw on fully matching types', () => {
        a('yes', 1, true, [] );
    });

    it('throws on wrong types', () => {
        expect(
            () => a(1, 1, true, [] )
        ).toThrow(new TypeError("1 is of the wrong type. Expected string, but got number."));
    });

});


describe('Type checking arrays of primitives', () => {

    function b(stringArray, numberArray, booleanArray) {
        y(
            [stringArray, [String]],
            [numberArray, [Number]],
            [booleanArray, [Boolean]],
        );
    }

    it('doesn\'t throw on fully matching types', () => {
        b(['yes'], [1], [true, false]);
        b(['yes'], [1], [true, false]);
        b(['yes'], [1], [true, false]);
    });

    it('throws on wrong types', () => {
        expect(
            () => b(['yes'], ['1'], [true])
        ).toThrow(new TypeError("[1] is of the wrong type. Expected array of number, but got array containing string."));
        expect(
            () => b('yes', ['1'], [true])
        ).toThrow(new TypeError("'yes' is of the wrong type. Expected array of string, but got string."));
    });

});


describe('Handling null/undefined values', () => {

    function c(var1, var2, var3) {
        y(
            [var1, String],
            [var2, Number],
            [var3, Boolean],
        );
    }

    it('throws on missing (undefined) values', () => {
        expect(
            () => c('1', 1)
        ).toThrow(new TypeError("undefined is of the wrong type. Expected boolean, but got undefined."));
    });

    it('throws on explicit undefined values', () => {
        expect(
            () => c('1', 1, undefined)
        ).toThrow(
            new TypeError("undefined is of the wrong type. Expected boolean, but got undefined.")
        );
    });

    it('throws on explicit undefined values', () => {
        expect(
            () => c('1', 1, null)
        ).toThrow(
            new TypeError("null is of the wrong type. Expected boolean, but got null.")
        );
    });


});


describe('Type checking nullable and union types', () => {

    function d(var1, var2, var3) {
        y(
            [var1, String, Number],
            [var2, Boolean],
            [var3, String, [String], null],
        );
    }

    it('doesn\'t throw on fully matching types', () => {
        d('yes', true, null);
        d(1, false, '1');
        d(1, false, ['1']);
    });

    it('throws on wrong types', () => {
        expect(
            () => d('yes', true, 5)
        ).toThrow(
            new TypeError("5 is of the wrong type. Expected either string, array of string or null, but got number.")
        );

        expect(
            () => d('yes', true, [5])
        ).toThrow(
            new TypeError("[5] is of the wrong type. Expected either string, array of string or null, but got array.") // TODO this should be 'array containing number'
        );
    });

});


describe('Type checking value types', () => {

    function e(var1, var2, var3) {
        y(
            [var1, y.values('one', 'two')],
            [var2, y.values('three', 4, 5)],
            [var3, y.values(9, false), null],
        );
    }

    it('doesn\'t throw on fully matching types', () => {
        e('one', 4, false);
        e('one', 5, 9);
        e('two', 'three', null);
    });

    it('throws on wrong types', () => {
        expect(
            () => e('four', 3, null)
        ).toThrow(
            new TypeError("'four' is of the wrong type. Expected one of values {'one', 'two'}, but got value {'four'}.")
        );

        expect(
            () => e('one', 8, null)
        ).toThrow(
            new TypeError("8 is of the wrong type. Expected one of values {'three', 4, 5}, but got value {8}.")
        );

        expect(
            () => e('one', {b: 8}, null)
        ).toThrow(
            new TypeError("{ b: 8 } is of the wrong type. Expected one of values {'three', 4, 5}, but got value {{ b: 8 }}.")
        );
    });

});


describe('Type checking range types', () => {

    function f(var1) {
        y(
            [var1, y.range(2, 7)],
        );
    }

    it('doesn\'t throw on fully matching types', () => {
        f(5);
        f(2);
        f(7);
    });

    it('throws on wrong types', () => {
        expect(
            () => f(1)
        ).toThrow(
            new TypeError("1 is of the wrong type. Expected a number in range {2 - 7}, but got value {1}.")
        );

        expect(
            () => f('gh')
        ).toThrow(
            new TypeError("'gh' is of the wrong type. Expected a number in range {2 - 7}, but got string.")
        );
    });

});


describe('Type checking shape types', () => {

    function g(var1) {
        y(
            [var1, y.shape({a: [String], b: [Number, null], c: [[String], String]})],
        );
    }

    it('doesn\'t throw on fully matching types', () => {
        g({a: 'go', b: 4, c: 'hi'});
        g({a: 'go', b: null, c: ['hi', 'ho']});
    });

    it('throws on wrong type of property', () => {
        expect(
            () => g(1)
        ).toThrow(
            new TypeError("1 is of the wrong type. Expected an object with shape { a: [ String ], b: [ Number, null ], c: [ [ String ], String ] }, but got number.")
        );
    });

    it('throws on wrong type of property', () => {
        expect(
            () => g({a: 1, b: 4, c: 'hi'})
        ).toThrow(
            new TypeError("{ a: 1, b: 4, c: 'hi' } is of the wrong type. Expected an object with shape { a: [ String ], b: [ Number, null ], c: [ [ String ], String ] }, but got property a as type number.")
        );

        // todo value types
    });

    it('throws on missing property', () => {
        expect(
            () => g({a: '1', b: 4})
        ).toThrow(
            new TypeError(`{ a: '1', b: 4 } is of the wrong type. Expected an object with shape { a: [ String ], b: [ Number, null ], c: [ [ String ], String ] }, but got an object with missing property c.`)
        );
    });

});

