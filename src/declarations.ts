export type RealJsType =
    "array"
    | "null"
    | "undefined"
    | "object"
    | "boolean"
    | "number"
    | "string"
    | "function"
    | "symbol"
    | "bigint";

export type DesiredType = Function | YpeType | null;

export type MismatchingTypeInfo = { name: string, type: string } | { name: RealJsType, type: RealJsType };

export type YpeType = {
    name: string,
    inherits: DesiredType[] | null,
    compareTypesAndGetMismatchingTypeInfo: (value: any, realJsTypeOfValue: RealJsType) => null | MismatchingTypeInfo,
    computeName: () => string,
}

export type DesiredTypeInfo =
    YpeType |
    {
        name: string,
        type: RealJsType | Array<RealJsType>
    };

export type TypeAssertion = Array<any>;
    