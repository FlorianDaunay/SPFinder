
export interface OptionListItem {
    id: number;
    type: string;
}

export interface Option {
    name: string;
    strike: number;
    coupon: number;
    knockIn: number;
    knockOut: number;
    c: number;
    p: number;
    leverage: number;
}

export interface OptionData {
    id: string;
    name: string;
    strike: number;
    coupon: number;
    knockIn: number;
    knockOut: number;
    c: number;
    p: number;
    leverage: number;
}



export interface StructuredProduct {
    id: string;
    name: string;
    options: Option[];
}



export interface User {
    id: number;
    username: string;
    email: string;
    myStructuredProductIds: number[];
}

