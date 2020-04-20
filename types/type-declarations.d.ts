export declare type RealJsType = "array" | "null" | "undefined" | "object" | "boolean" | "number" | "string" | "function" | "symbol" | "bigint";
export declare type DesiredType = Function | YpeType | null;
export declare type MismatchingTypeInfo = {
    name: string;
    type: string;
} | {
    name: RealJsType;
    type: RealJsType;
};
export declare type YpeType = {
    name: string;
    inherits: DesiredType[] | null;
    compareTypesAndGetMismatchingTypeInfo: (value: any, realJsTypeOfValue: RealJsType) => null | MismatchingTypeInfo;
    computeName: () => string;
};
export declare type DesiredTypeInfo = YpeType | {
    name: string;
    type: RealJsType | Array<RealJsType>;
};
